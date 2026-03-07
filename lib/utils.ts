import { type ClassValue, clsx } from "clsx";

// ─── Class Merger ─────────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

export function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function daysUntil(date: Date | string): number {
    const now = new Date();
    const target = new Date(date);
    const diffMs = target.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

// ─── API Helpers ──────────────────────────────────────────────────────────────

export function apiError(message: string, status = 400) {
    return Response.json({ success: false, error: message }, { status });
}

export function apiSuccess<T>(data: T, status = 200) {
    return Response.json({ success: true, data }, { status });
}

// ─── Blood Group Utilities ────────────────────────────────────────────────────

export const BLOOD_GROUP_COLORS: Record<string, string> = {
    "A+": "#ef4444",
    "A-": "#f97316",
    "B+": "#8b5cf6",
    "B-": "#6366f1",
    "AB+": "#0ea5e9",
    "AB-": "#14b8a6",
    "O+": "#22c55e",
    "O-": "#eab308",
};

export function getBloodGroupColor(group: string): string {
    return BLOOD_GROUP_COLORS[group] ?? "#6b7280";
}

// ─── Urgency Utilities ────────────────────────────────────────────────────────

export const URGENCY_CONFIG = {
    Routine: { label: "Routine", color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/30" },
    Urgent: { label: "Urgent", color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30" },
    STAT: { label: "🚨 STAT", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/30" },
} as const;

// ─── Request Status Utilities ─────────────────────────────────────────────────

export const STATUS_STEPS = ["Pending", "Approved", "InTransit", "Fulfilled"] as const;

export function getStatusIndex(status: string): number {
    return STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);
}
