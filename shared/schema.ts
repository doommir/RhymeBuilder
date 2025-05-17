import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  xp: integer("xp").notNull().default(0),
  password: text("password").notNull(),
});

export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  imagePath: text("image_path").notNull(),
  isLocked: boolean("is_locked").notNull().default(false),
  xpReward: integer("xp_reward").notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  question: text("question").notNull(),
  imageUrl: text("image_url"),
});

export const options = pgTable("options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => questions.id),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Option = typeof options.$inferSelect;
