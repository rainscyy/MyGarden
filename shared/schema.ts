import { z } from "zod";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Category name is required"),
  color: z.string(),
});

export const insertCategorySchema = categorySchema.omit({ id: true });
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = z.infer<typeof categorySchema>;

export const sessionSchema = z.object({
  id: z.string(),
  categoryId: z.string(),
  title: z.string().min(1, "Session title is required"),
  minutesFocused: z.number().min(1, "Minutes must be at least 1"),
  status: z.enum(["done", "failed"]),
  dateISO: z.string(),
});

export const insertSessionSchema = sessionSchema.omit({ id: true });
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type Session = z.infer<typeof sessionSchema>;

export type CategoryStatus = "healthy" | "barren";

export interface CategoryStats {
  category: Category;
  totalMinutes: number;
  doneCount: number;
  failedCount: number;
  status: CategoryStatus;
}

export interface MonthlyData {
  month: string;
  minutes: number;
}
