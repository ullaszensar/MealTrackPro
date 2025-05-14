import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  role: text("role").notNull().default("staff"), // "staff" or "admin"
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  displayName: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Meal submission model
export const mealSubmissions = pgTable("meal_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  submissionDate: timestamp("submission_date").notNull().defaultNow(),
  mealDate: timestamp("meal_date").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, needs_adjustment
  notes: text("notes"),
});

export const insertMealSubmissionSchema = createInsertSchema(mealSubmissions).pick({
  userId: true,
  mealDate: true,
  notes: true,
});

export type InsertMealSubmission = z.infer<typeof insertMealSubmissionSchema>;
export type MealSubmission = typeof mealSubmissions.$inferSelect;

// Meal counts model
export const mealCounts = pgTable("meal_counts", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id").notNull(),
  mealType: text("meal_type").notNull(), // breakfast, lunch, dinner
  adultCount: integer("adult_count").notNull().default(0),
  childCount: integer("child_count").notNull().default(0),
  specialRequirements: text("special_requirements"),
});

export const insertMealCountSchema = createInsertSchema(mealCounts).pick({
  submissionId: true,
  mealType: true,
  adultCount: true,
  childCount: true,
  specialRequirements: true,
});

export type InsertMealCount = z.infer<typeof insertMealCountSchema>;
export type MealCount = typeof mealCounts.$inferSelect;

// Extended schema with joined data
export type MealSubmissionWithCounts = MealSubmission & {
  user: User;
  counts: MealCount[];
};

// Create meal submission with counts schema - for API
export const createMealSubmissionSchema = z.object({
  mealDate: z.string().refine((date) => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }, {
    message: "Invalid date format",
  }),
  notes: z.string().optional(),
  breakfast: z.object({
    adultCount: z.number().int().min(0),
    childCount: z.number().int().min(0),
    specialRequirements: z.string().optional(),
  }),
  lunch: z.object({
    adultCount: z.number().int().min(0),
    childCount: z.number().int().min(0),
    specialRequirements: z.string().optional(),
  }),
  dinner: z.object({
    adultCount: z.number().int().min(0),
    childCount: z.number().int().min(0),
    specialRequirements: z.string().optional(),
  }),
});

export type CreateMealSubmission = z.infer<typeof createMealSubmissionSchema>;

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type Login = z.infer<typeof loginSchema>;
