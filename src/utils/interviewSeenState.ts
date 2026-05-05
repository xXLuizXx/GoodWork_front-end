const STORAGE_PREFIX = "interview_seen_";

interface SeenEntry {
    status: string;
    scheduled_date: string;
    notice: string | null;
}

type SeenSnapshot = Record<string, SeenEntry>;

function storageKey(userId: string): string {
    return `${STORAGE_PREFIX}${userId}`;
}

export function getSeenSnapshot(userId: string): SeenSnapshot {
    if (typeof window === "undefined" || !userId) return {};
    try {
        const raw = localStorage.getItem(storageKey(userId));
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

export interface SeenableInterview {
    id: string;
    status: string;
    scheduled_date: string;
    notice?: string | null;
}

export function markInterviewsAsSeen(userId: string, interviews: SeenableInterview[]): void {
    if (typeof window === "undefined" || !userId) return;
    const snapshot: SeenSnapshot = {};
    for (const iv of interviews) {
        snapshot[iv.id] = {
            status: iv.status,
            scheduled_date: iv.scheduled_date,
            notice: iv.notice ?? null,
        };
    }
    try {
        localStorage.setItem(storageKey(userId), JSON.stringify(snapshot));
    } catch {}
}
