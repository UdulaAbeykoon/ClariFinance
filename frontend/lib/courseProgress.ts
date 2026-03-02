// Shared course progress utilities — uses localStorage for persistence.
// Progress is tracked as the user views PDF pages.

const STORAGE_PREFIX = "clarifi-progress-";

/**
 * Get the saved progress for a course (0–100).
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
 */
export function setCourseProgress(courseId: string, progress: number): number {
    if (typeof window === "undefined") return 0;
    try {
        const clamped = Math.min(100, Math.max(0, Math.round(progress)));
        const current = getCourseProgress(courseId);

        if (clamped > current) {
            localStorage.setItem(`${STORAGE_PREFIX}${courseId}`, String(clamped));
            return clamped;
        }
        return current;
    } catch {
        return 0; // localStorage unavailable
    }
}
