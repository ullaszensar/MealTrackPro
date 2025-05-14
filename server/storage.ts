import { users, type User, type InsertUser } from "@shared/schema";
import { mealSubmissions, type MealSubmission, type InsertMealSubmission } from "@shared/schema";
import { mealCounts, type MealCount, type InsertMealCount } from "@shared/schema";
import { type MealSubmissionWithCounts, type CreateMealSubmission } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Meal submission methods
  createMealSubmission(
    userId: number, 
    submission: CreateMealSubmission
  ): Promise<MealSubmissionWithCounts>;
  getMealSubmission(id: number): Promise<MealSubmissionWithCounts | undefined>;
  getMealSubmissionsByUser(userId: number): Promise<MealSubmissionWithCounts[]>;
  getAllMealSubmissions(): Promise<MealSubmissionWithCounts[]>;
  getMealSubmissionsByDate(date: Date): Promise<MealSubmissionWithCounts[]>;
  updateMealSubmissionStatus(id: number, status: string): Promise<MealSubmissionWithCounts | undefined>;
  getSubmissionsForDateRange(startDate: Date, endDate: Date): Promise<MealSubmissionWithCounts[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private mealSubmissions: Map<number, MealSubmission>;
  private mealCounts: Map<number, MealCount[]>;
  private userIdCounter: number;
  private submissionIdCounter: number;
  private mealCountIdCounter: number;

  constructor() {
    this.users = new Map();
    this.mealSubmissions = new Map();
    this.mealCounts = new Map();
    this.userIdCounter = 1;
    this.submissionIdCounter = 1;
    this.mealCountIdCounter = 1;

    // Initialize with demo users
    this.createUser({
      username: "admin",
      password: "password", // In a real app, this would be hashed
      displayName: "Admin User",
      role: "admin",
    });
    
    this.createUser({
      username: "staff",
      password: "password", // In a real app, this would be hashed
      displayName: "John Staff",
      role: "staff",
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Meal submission methods
  async createMealSubmission(
    userId: number,
    submission: CreateMealSubmission
  ): Promise<MealSubmissionWithCounts> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const mealDate = new Date(submission.mealDate);
    
    // Create meal submission
    const id = this.submissionIdCounter++;
    const mealSubmission: MealSubmission = {
      id,
      userId,
      submissionDate: new Date(),
      mealDate,
      status: "pending",
      notes: submission.notes || null,
    };
    this.mealSubmissions.set(id, mealSubmission);

    // Create meal counts
    const counts: MealCount[] = [];
    
    // Breakfast
    const breakfastCount: MealCount = {
      id: this.mealCountIdCounter++,
      submissionId: id,
      mealType: "breakfast",
      adultCount: submission.breakfast.adultCount,
      childCount: submission.breakfast.childCount,
      specialRequirements: submission.breakfast.specialRequirements || null,
    };
    counts.push(breakfastCount);
    
    // Lunch
    const lunchCount: MealCount = {
      id: this.mealCountIdCounter++,
      submissionId: id,
      mealType: "lunch",
      adultCount: submission.lunch.adultCount,
      childCount: submission.lunch.childCount,
      specialRequirements: submission.lunch.specialRequirements || null,
    };
    counts.push(lunchCount);
    
    // Dinner
    const dinnerCount: MealCount = {
      id: this.mealCountIdCounter++,
      submissionId: id,
      mealType: "dinner",
      adultCount: submission.dinner.adultCount,
      childCount: submission.dinner.childCount,
      specialRequirements: submission.dinner.specialRequirements || null,
    };
    counts.push(dinnerCount);
    
    this.mealCounts.set(id, counts);
    
    return {
      ...mealSubmission,
      user,
      counts,
    };
  }

  async getMealSubmission(id: number): Promise<MealSubmissionWithCounts | undefined> {
    const submission = this.mealSubmissions.get(id);
    if (!submission) {
      return undefined;
    }

    const user = await this.getUser(submission.userId);
    if (!user) {
      return undefined;
    }

    const counts = this.mealCounts.get(id) || [];

    return {
      ...submission,
      user,
      counts,
    };
  }

  async getMealSubmissionsByUser(userId: number): Promise<MealSubmissionWithCounts[]> {
    const user = await this.getUser(userId);
    if (!user) {
      return [];
    }

    const submissions = Array.from(this.mealSubmissions.values())
      .filter(submission => submission.userId === userId);

    return Promise.all(
      submissions.map(async (submission) => {
        const counts = this.mealCounts.get(submission.id) || [];
        return {
          ...submission,
          user,
          counts,
        };
      })
    );
  }

  async getAllMealSubmissions(): Promise<MealSubmissionWithCounts[]> {
    return Promise.all(
      Array.from(this.mealSubmissions.values()).map(async (submission) => {
        const user = await this.getUser(submission.userId) as User;
        const counts = this.mealCounts.get(submission.id) || [];
        return {
          ...submission,
          user,
          counts,
        };
      })
    );
  }

  async getMealSubmissionsByDate(date: Date): Promise<MealSubmissionWithCounts[]> {
    const dateString = date.toISOString().split('T')[0];
    
    return Promise.all(
      Array.from(this.mealSubmissions.values())
        .filter(submission => {
          const submissionDate = submission.mealDate.toISOString().split('T')[0];
          return submissionDate === dateString;
        })
        .map(async (submission) => {
          const user = await this.getUser(submission.userId) as User;
          const counts = this.mealCounts.get(submission.id) || [];
          return {
            ...submission,
            user,
            counts,
          };
        })
    );
  }

  async updateMealSubmissionStatus(
    id: number, 
    status: string
  ): Promise<MealSubmissionWithCounts | undefined> {
    const submission = this.mealSubmissions.get(id);
    if (!submission) {
      return undefined;
    }

    const updatedSubmission = {
      ...submission,
      status,
    };
    this.mealSubmissions.set(id, updatedSubmission);

    return this.getMealSubmission(id);
  }

  async getSubmissionsForDateRange(
    startDate: Date, 
    endDate: Date
  ): Promise<MealSubmissionWithCounts[]> {
    return Promise.all(
      Array.from(this.mealSubmissions.values())
        .filter(submission => {
          return submission.mealDate >= startDate && submission.mealDate <= endDate;
        })
        .map(async (submission) => {
          const user = await this.getUser(submission.userId) as User;
          const counts = this.mealCounts.get(submission.id) || [];
          return {
            ...submission,
            user,
            counts,
          };
        })
    );
  }
}

export const storage = new MemStorage();
