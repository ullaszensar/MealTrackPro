import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { loginSchema, createMealSubmissionSchema } from "@shared/schema";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup session
  const SessionStore = MemoryStore(session);
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "meal-planning-secret",
      resave: true,
      saveUninitialized: true,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
      },
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Setup passport strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  // Serialize user for session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Authentication middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  const isAdmin = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === "admin") {
      return next();
    }
    res.status(403).json({ message: "Forbidden" });
  };

  // Auth Routes
  app.post("/api/login", (req, res, next) => {
    try {
      console.log("Login attempt:", req.body);
      
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const { username, password } = result.data;
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          console.error("Authentication error:", err);
          return next(err);
        }
        
        if (!user) {
          console.log("Authentication failed:", info?.message);
          return res.status(401).json({ message: info?.message || "Invalid credentials" });
        }
        
        req.login(user, (err) => {
          if (err) {
            console.error("Login error:", err);
            return next(err);
          }
          
          console.log("Login successful for user:", user.username);
          return res.json({
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            role: user.role,
          });
        });
      })(req, res, next);
    } catch (error) {
      console.error("Login route error:", error);
      res.status(500).json({ message: "Server error during login" });
    }
  });

  app.post("/api/logout", (req, res) => {
    console.log("Logout attempt for user:", req.user);
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      console.log("Logout successful");
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", (req, res) => {
    console.log("User session check:", req.isAuthenticated(), req.user);
    
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    });
  });

  // Meal Submission Routes
  app.post("/api/meal-submissions", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const submissionData = createMealSubmissionSchema.parse(req.body);
      
      const mealSubmission = await storage.createMealSubmission(
        user.id, 
        submissionData
      );
      
      res.status(201).json(mealSubmission);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid request" });
      }
    }
  });

  app.get("/api/meal-submissions", isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      let submissions;
      
      if (user.role === "admin") {
        // Admin can see all submissions
        submissions = await storage.getAllMealSubmissions();
      } else {
        // Staff can only see their own submissions
        submissions = await storage.getMealSubmissionsByUser(user.id);
      }
      
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/meal-submissions/date/:date", isAuthenticated, async (req, res) => {
    try {
      const dateStr = req.params.date;
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const submissions = await storage.getMealSubmissionsByDate(date);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.patch("/api/meal-submissions/:id/status", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { status } = req.body;
      
      if (!id || !status || !["pending", "approved", "needs_adjustment"].includes(status)) {
        return res.status(400).json({ message: "Invalid request" });
      }
      
      const updatedSubmission = await storage.updateMealSubmissionStatus(id, status);
      
      if (!updatedSubmission) {
        return res.status(404).json({ message: "Submission not found" });
      }
      
      res.json(updatedSubmission);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Report Routes
  app.get("/api/reports/range", isAdmin, async (req, res) => {
    try {
      const { start, end } = req.query;
      
      if (!start || !end) {
        return res.status(400).json({ message: "Start and end dates are required" });
      }
      
      const startDate = new Date(start as string);
      const endDate = new Date(end as string);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }
      
      const submissions = await storage.getSubmissionsForDateRange(startDate, endDate);
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User Management Routes (Admin only)
  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(u => ({
        id: u.id,
        username: u.username,
        displayName: u.displayName,
        role: u.role,
      })));
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/users", isAdmin, async (req, res) => {
    try {
      const userData = req.body;
      
      if (!userData.username || !userData.password || !userData.displayName || !userData.role) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      
      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  return httpServer;
}
