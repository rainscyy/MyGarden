import { useState, useEffect, useCallback } from "react";
import {
  getCategories,
  getSessions,
  addCategory as addCategoryStorage,
  updateCategory as updateCategoryStorage,
  deleteCategory as deleteCategoryStorage,
  addSession as addSessionStorage,
  deleteSession as deleteSessionStorage,
  getSessionsLast7Days,
  getMonthlyFocusData,
  initializeStorage,
} from "@/lib/storage";
import type { Category, Session, CategoryStats } from "@shared/schema";

export function useData() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setCategories(getCategories());
    setSessions(getSessions());
  }, []);

  useEffect(() => {
    initializeStorage();
    refresh();
    setLoading(false);
  }, [refresh]);

  const addCategory = useCallback((name: string, color: string) => {
    const newCat = addCategoryStorage(name, color);
    refresh();
    return newCat;
  }, [refresh]);

  const updateCategory = useCallback((id: string, name: string, color: string) => {
    updateCategoryStorage(id, name, color);
    refresh();
  }, [refresh]);

  const deleteCategory = useCallback((id: string) => {
    deleteCategoryStorage(id);
    refresh();
  }, [refresh]);

  const addSession = useCallback(
    (
      categoryId: string,
      title: string,
      minutesFocused: number,
      status: "done" | "failed",
      dateISO: string
    ) => {
      const newSession = addSessionStorage(categoryId, title, minutesFocused, status, dateISO);
      refresh();
      return newSession;
    },
    [refresh]
  );

  const deleteSession = useCallback((id: string) => {
    deleteSessionStorage(id);
    refresh();
  }, [refresh]);

  const getCategoryStats = useCallback((): CategoryStats[] => {
    const cats = getCategories();
    const sevenDaysSessions = getSessionsLast7Days();

    return cats.map((cat) => {
      const catSessions = sevenDaysSessions.filter((s) => s.categoryId === cat.id);
      const totalMinutes = catSessions.reduce((sum, s) => sum + s.minutesFocused, 0);
      const doneCount = catSessions.filter((s) => s.status === "done").length;
      const failedCount = catSessions.filter((s) => s.status === "failed").length;
      const status = catSessions.length === 0 ? "barren" : "healthy";

      return { category: cat, totalMinutes, doneCount, failedCount, status };
    });
  }, []);

  const getMonthlyData = useCallback(() => {
    return getMonthlyFocusData();
  }, []);

  return {
    categories,
    sessions,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    addSession,
    deleteSession,
    getCategoryStats,
    getMonthlyData,
    refresh,
  };
}
