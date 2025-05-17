import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enhanced user model with gamification features
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  xp: integer("xp").notNull().default(0),
  streak: integer("streak").notNull().default(1),
  lastActive: text("last_active").notNull().default(new Date().toISOString()),
  completedLessons: json("completed_lessons").$type<string[]>().notNull().default([]),
  password: text("password").notNull(),
});

// Lessons table
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  lessonKey: text("lesson_key").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: integer("level").notNull().default(1),
  totalXp: integer("total_xp").notNull().default(0),
  imagePath: text("image_path"),
  requiresLessonKey: text("requires_lesson_key"),
  requiresLevel: integer("requires_level"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Exercises table for different microlearning activities
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  exerciseType: text("exercise_type").notNull(),
  question: text("question").notNull(),
  explanation: text("explanation"),
  xpReward: integer("xp_reward").notNull().default(5),
  data: json("data").notNull(), // Store exercise-specific data like options, matching pairs, etc.
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// User Progress for tracking exercise completion
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  lessonKey: text("lesson_key").notNull(),
  exercisesCompleted: integer("exercises_completed").notNull().default(0),
  totalExercises: integer("total_exercises").notNull(),
  xpEarned: integer("xp_earned").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  lastAttemptAt: timestamp("last_attempt_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertLessonSchema = createInsertSchema(lessons).pick({
  lessonKey: true,
  title: true,
  description: true,
  level: true,
  totalXp: true,
  imagePath: true,
  requiresLessonKey: true,
  requiresLevel: true,
});

export const insertExerciseSchema = createInsertSchema(exercises).pick({
  lessonId: true,
  exerciseType: true,
  question: true,
  explanation: true,
  xpReward: true,
  data: true,
  orderIndex: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).pick({
  userId: true,
  lessonKey: true,
  exercisesCompleted: true,
  totalExercises: true,
  xpEarned: true,
  isCompleted: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;

// Type for exercise data field
export type ExerciseData = 
  | { type: 'multiple-choice', options: Array<{id: string, text: string, isCorrect: boolean}> }
  | { type: 'fill-blank', sentence: string, blankIndex: number, options: Array<{id: string, text: string, isCorrect: boolean}> }
  | { type: 'matching', pairs: Array<{id: string, left: string, right: string}> }
  | { type: 'tap-word', correctSequence: string[], wordOptions: string[] }
  | { type: 'flashcard', term: string, definition: string };
