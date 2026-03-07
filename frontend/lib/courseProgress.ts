// Shared course progress utilities — uses Supabase for persistence,
// with localStorage as a fast cache layer.

import { createClient } from "@/utils/supabase/client";

const STORAGE_PREFIX = "clarifi-progress-";

/**
 * Get the saved progress for a course (0–100) from localStorage cache.
 * Returns 0 if no progress has been recorded.
 */
export function getCourseProgress(courseId: string): number {
    if (typeof window === "undefined") return 0;
    try {
        const raw = localStorage.getItem(`${STORAGE_PREFIX}${courseId}`);
        return raw ? Math.min(100, Math.max(0, parseInt(raw, 10) || 0)) : 0;
    } catch {
        return 0;
    }
}

/**
 * Save progress for a course.  Only updates if the new value
 * is higher than what's already stored (progress never decreases).
 * Also persists to Supabase in the background.
 */
export function setCourseProgress(courseId: string, progress: number): number {
    if (typeof window === "undefined") return 0;
    try {
        const clamped = Math.min(100, Math.max(0, Math.round(progress)));
        const current = getCourseProgress(courseId);

        if (clamped > current) {
            localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, String(clamped));
            // Fire-and-forget save to Supabase
            saveProgressToSupabase(courseId, clamped);
            return clamped;
        }
        return current;
    } catch {
        return 0; // localStorage unavailable
    }
}

/**
 * Load all course progress from Supabase into localStorage.
 * Call this once after the user logs in / on page load.
 * Returns a map of courseId -> progress.
 */
export async function loadProgressFromSupabase(): Promise<Record<string, number>> {
    const result: Record<string, number> = {};
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return result;

        const { data, error } = await supabase
            .from("user_progress")
            .select("course_id, progress")
            .eq("user_id", user.id);

        if (error) {
            console.error("Failed to load progress from Supabase:", error.message);
            return result;
        }

        if (data) {
            for (const row of data) {
                const progress = Math.min(100, Math.max(0, row.progress || 0));
                result[row.course_id] = progress;
                // Also update localStorage cache — take the max of local and remote
                const localVal = getCourseProgress(row.course_id);
                const best = Math.max(localVal, progress);
                localStorage.setItem(`${STORAGE_PREFIX}${row.course_id}`, String(best));
                result[row.course_id] = best;
            }
        }
    } catch (err) {
        console.error("Error loading progress:", err);
    }
    return result;
}

/**
 * Persist a single course's progress to Supabase (fire-and-forget).
 */
async function saveProgressToSupabase(courseId: string, progress: number) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from("user_progress")
            .upsert(
                {
                    user_id: user.id,
                    course_id: courseId,
                    progress,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id,course_id" }
            );
    } catch (err) {
        console.error("Error saving progress to Supabase:", err);
    }
}
