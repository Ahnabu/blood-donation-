"use client";
import Link from "next/link";
import { Heart, ShieldOff } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1rem",
                textAlign: "center",
                background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(230,57,70,0.10), transparent)",
            }}
        >
            <ShieldOff
                style={{ width: 56, height: 56, color: "var(--primary)", marginBottom: "1.25rem", opacity: 0.8 }}
                aria-hidden="true"
            />
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text)" }}>
                Access Denied
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: 380, marginBottom: "2rem" }}>
                You don&apos;t have permission to view this page.
            </p>
            <Link
                href="/dashboard"
                className="btn-primary"
                style={{ padding: "0.625rem 1.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
            >
                <Heart className="w-4 h-4" aria-hidden="true" />
                Back to Dashboard
            </Link>
        </div>
    );
}
