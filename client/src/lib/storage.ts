import type { Category, Session } from "@shared/schema";

const CATEGORIES_KEY = "forest_garden_categories";
const SESSIONS_KEY = "forest_garden_sessions";
const INITIALIZED_KEY = "forest_garden_initialized";

function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

function getDateDaysAgo(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split("T")[0];
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat1", name: "Work", color: "#22c55e" },
  { id: "cat2", name: "Learning", color: "#3b82f6" },
];

function generateMockSessions(): Session[] {
  const sessions: Session[] = [];
  const today = new Date();
  
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateISO = date.toISOString().split("T")[0];
    
    if (Math.random() > 0.3) {
      sessions.push({
        id: generateId(),
        categoryId: "cat1",
        title: `Work session ${i + 1}`,
        minutesFocused: Math.floor(Math.random() * 60) + 15,
        status: Math.random() > 0.2 ? "done" : "failed",
        dateISO,
      });
    }
    
    if (Math.random() > 0.5) {
      sessions.push({
        id: generateId(),
        categoryId: "cat2",
        title: `Learning session ${i + 1}`,
        minutesFocused: Math.floor(Math.random() * 45) + 10,
        status: Math.random() > 0.15 ? "done" : "failed",
        dateISO,
      });
    }
  }
  
  return sessions;
}

export function initializeStorage(): void {
  if (typeof window === "undefined") return;
  
  const initialized = localStorage.getItem(INITIALIZED_KEY);
  if (initialized) return;
  
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(generateMockSessions()));
  localStorage.setItem(INITIALIZED_KEY, "true");
}

export function getCategories(): Category[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CATEGORIES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveCategories(categories: Category[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

export function addCategory(name: string, color: string): Category {
  const categories = getCategories();
  const newCategory: Category = { id: generateId(), name, color };
  categories.push(newCategory);
  saveCategories(categories);
  return newCategory;
}

export function updateCategory(id: string, name: string, color: string): void {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], name, color };
    saveCategories(categories);
  }
}

export function deleteCategory(id: string): void {
  const categories = getCategories().filter((c) => c.id !== id);
  saveCategories(categories);
  
  const sessions = getSessions().filter((s) => s.categoryId !== id);
  saveSessions(sessions);
}

export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSessions(sessions: Session[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function addSession(
  categoryId: string,
  title: string,
  minutesFocused: number,
  status: "done" | "failed",
  dateISO: string
): Session {
  const sessions = getSessions();
  const newSession: Session = {
    id: generateId(),
    categoryId,
    title,
    minutesFocused,
    status,
    dateISO,
  };
  sessions.push(newSession);
  saveSessions(sessions);
  return newSession;
}

export function deleteSession(id: string): void {
  const sessions = getSessions().filter((s) => s.id !== id);
  saveSessions(sessions);
}

export function getSessionsLast7Days(categoryId?: string): Session[] {
  const sessions = getSessions();
  const sevenDaysAgo = getDateDaysAgo(7);
  
  return sessions.filter((s) => {
    const inRange = s.dateISO >= sevenDaysAgo;
    const matchesCategory = categoryId ? s.categoryId === categoryId : true;
    return inRange && matchesCategory;
  });
}

export function getMonthlyFocusData(): { month: string; minutes: number }[] {
  const sessions = getSessions();
  const today = new Date();
  const monthlyData: Record<string, number> = {};
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const key = date.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    monthlyData[key] = 0;
  }
  
  sessions.forEach((session) => {
    const sessionDate = new Date(session.dateISO);
    const key = sessionDate.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    if (key in monthlyData) {
      monthlyData[key] += session.minutesFocused;
    }
  });
  
  return Object.entries(monthlyData).map(([month, minutes]) => ({ month, minutes }));
}
