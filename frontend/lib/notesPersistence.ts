// Supabase-backed notes persistence.
// Uses localStorage as a fast cache, syncs to/from Supabase.

import { createClient } from "@/utils/supabase/client";
import type { PdfNote } from "@/components/PdfViewer";

const NOTES_STORAGE_KEY = (courseId: string) => `clarifi-notes-${courseId}`;

/**
 * Get notes from localStorage cache.
 */
export function getLocalNotes(courseId: string): PdfNote[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(NOTES_STORAGE_KEY(courseId));
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

/**
 * Save notes to localStorage cache.
 */
export function setLocalNotes(courseId: string, notes: PdfNote[]) {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(NOTES_STORAGE_KEY(courseId), JSON.stringify(notes));
    } catch { }
}

/**
 * Load all notes for a course from Supabase.
 * Merges with any local-only notes (by id) and returns the combined set.
 */
export async function loadNotesFromSupabase(courseId: string): Promise<PdfNote[]> {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return getLocalNotes(courseId);

        const { data, error } = await supabase
            .from("user_notes")
            .select("*")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .order("timestamp", { ascending: false });

        if (error) {
            console.error("Failed to load notes from Supabase:", error.message);
            return getLocalNotes(courseId);
        }

        const remoteNotes: PdfNote[] = (data || []).map((row: {
            note_id: string;
            highlighted_text: string;
            note_text: string;
            page_number: number;
            timestamp: number;
        }) => ({
            id: row.note_id,
            highlightedText: row.highlighted_text || "",
            noteText: row.note_text,
            pageNumber: row.page_number || 0,
            timestamp: row.timestamp || Date.now(),
        }));

        // Merge: remote notes take priority; add any local-only notes
        const localNotes = getLocalNotes(courseId);
        const remoteIds = new Set(remoteNotes.map((n) => n.id));
        const localOnly = localNotes.filter((n) => !remoteIds.has(n.id));

        // Upload any local-only notes to Supabase
        for (const note of localOnly) {
            await saveNoteToSupabase(courseId, note);
        }

        const merged = [...remoteNotes, ...localOnly].sort(
            (a, b) => b.timestamp - a.timestamp
        );
        setLocalNotes(courseId, merged);
        return merged;
    } catch (err) {
        console.error("Error loading notes:", err);
        return getLocalNotes(courseId);
    }
}

/**
 * Save a single note to Supabase (fire-and-forget).
 */
export async function saveNoteToSupabase(courseId: string, note: PdfNote) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase.from("user_notes").upsert(
            {
                user_id: user.id,
                course_id: courseId,
                note_id: note.id,
                highlighted_text: note.highlightedText || "",
                note_text: note.noteText,
                page_number: note.pageNumber || 0,
                timestamp: note.timestamp,
            },
            { onConflict: "user_id,note_id" }
        );
    } catch (err) {
        console.error("Error saving note to Supabase:", err);
    }
}

/**
 * Delete a note from Supabase.
 */
export async function deleteNoteFromSupabase(noteId: string) {
    try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from("user_notes")
            .delete()
            .eq("user_id", user.id)
            .eq("note_id", noteId);
    } catch (err) {
        console.error("Error deleting note from Supabase:", err);
    }
}
