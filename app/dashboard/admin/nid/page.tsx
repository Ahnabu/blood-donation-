"use client";
import { useState, useEffect } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Clock, ExternalLink, User } from "lucide-react";

interface PendingUser {
    _id: string;
    name: string;
    email: string;
    nidImage: string;
    createdAt: string;
}

function getInitials(name: string) {
    return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

export default function NIDQueue() {
    const [queue, setQueue] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [acting, setActing] = useState<string | null>(null);

    useEffect(() => { fetchQueue(); }, []);

    async function fetchQueue() {
        try {
            const res = await fetch("/api/nid/queue");
            const json = await res.json();
            if (json.success) setQueue(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleReview(userId: string, action: "approved" | "rejected") {
        setActing(userId + action);
        try {
            const res = await fetch("/api/nid/approve", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action }),
            });
            const json = await res.json();
            if (json.success) {
                setQueue(q => q.filter(u => u._id !== userId));
            } else {
                alert("Error: " + json.error);
            }
        } catch {
            alert("An error occurred");
        } finally {
            setActing(null);
        }
    }

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 0 3rem" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(230,57,70,0.14)", border: "1px solid rgba(230,57,70,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShieldAlert style={{ width: 22, height: 22, color: "var(--primary)" }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)", fontWeight: 700, lineHeight: 1.2 }}>NID Verification Queue</h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.2rem" }}>Review pending national ID submissions</p>
                    </div>
                </div>
                {!loading && queue.length > 0 && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.875rem", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", borderRadius: 999, fontSize: "0.8125rem", fontWeight: 600, color: "#fbbf24", flexShrink: 0 }}>
                        <Clock style={{ width: 13, height: 13 }} />
                        {queue.length} pending
                    </div>
                )}
            </div>

            {/* Body */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[1, 2].map(i => (
                        <div key={i} className="glass" style={{ padding: "1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                                <div style={{ height: 14, width: "40%", borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
                                <div style={{ height: 11, width: "60%", borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : queue.length === 0 ? (
                <div className="glass" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                        <ShieldCheck style={{ width: 30, height: 30, color: "#4ade80" }} />
                    </div>
                    <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "0.5rem" }}>All Caught Up!</h3>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>No pending NID verification requests.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {queue.map(user => (
                        <div key={user._id} className="glass" style={{ padding: "clamp(1.25rem, 3vw, 1.75rem)", display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                            {/* Top row: avatar + info + NID thumbnail */}
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", flexWrap: "wrap" }}>
                                {/* Avatar */}
                                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(230,57,70,0.15)", border: "1px solid rgba(230,57,70,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.9rem", fontWeight: 700, color: "var(--primary)" }}>
                                    {user.name ? getInitials(user.name) : <User style={{ width: 20, height: 20 }} />}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                                    <p style={{ fontSize: "0.8375rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.5rem" }}>
                                        <Clock style={{ width: 12, height: 12, color: "var(--text-faint)" }} />
                                        <span style={{ fontSize: "0.775rem", color: "var(--text-faint)" }}>
                                            Submitted {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                        </span>
                                    </div>
                                </div>

                                {/* NID thumbnail */}
                                {user.nidImage ? (
                                    <a
                                        href={user.nidImage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ flexShrink: 0, position: "relative", display: "block", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", width: 110, height: 70 }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={user.nidImage} alt="NID" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                                            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                                            onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                                        >
                                            <ExternalLink style={{ width: 18, height: 18, color: "#fff" }} />
                                        </div>
                                    </a>
                                ) : (
                                    <div style={{ flexShrink: 0, width: 110, height: 70, borderRadius: 10, border: "1px dashed rgba(251,191,36,0.3)", background: "rgba(251,191,36,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <span style={{ fontSize: "0.7rem", color: "#fbbf24", textAlign: "center", padding: "0 0.5rem", lineHeight: 1.4 }}>No image</span>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />

                            {/* Actions */}
                            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                                <button
                                    onClick={() => handleReview(user._id, "approved")}
                                    disabled={acting !== null}
                                    style={{
                                        flex: 1, minWidth: 110, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                        padding: "0.6875rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(74,222,128,0.3)",
                                        background: acting === user._id + "approved" ? "rgba(74,222,128,0.25)" : "rgba(74,222,128,0.1)",
                                        color: "#4ade80", fontWeight: 600, fontSize: "0.875rem", cursor: acting ? "not-allowed" : "pointer", opacity: acting && acting !== user._id + "approved" ? 0.5 : 1, transition: "all 0.15s",
                                    }}
                                >
                                    <CheckCircle2 style={{ width: 16, height: 16 }} />
                                    {acting === user._id + "approved" ? "Approving…" : "Approve"}
                                </button>
                                <button
                                    onClick={() => handleReview(user._id, "rejected")}
                                    disabled={acting !== null}
                                    style={{
                                        flex: 1, minWidth: 110, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                        padding: "0.6875rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(230,57,70,0.3)",
                                        background: acting === user._id + "rejected" ? "rgba(230,57,70,0.2)" : "rgba(230,57,70,0.08)",
                                        color: "var(--primary)", fontWeight: 600, fontSize: "0.875rem", cursor: acting ? "not-allowed" : "pointer", opacity: acting && acting !== user._id + "rejected" ? 0.5 : 1, transition: "all 0.15s",
                                    }}
                                >
                                    <XCircle style={{ width: 16, height: 16 }} />
                                    {acting === user._id + "rejected" ? "Rejecting…" : "Reject"}
                                </button>
                                {user.nidImage && (
                                    <a
                                        href={user.nidImage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                                            padding: "0.6875rem 1.25rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(96,165,250,0.3)",
                                            background: "rgba(96,165,250,0.08)", color: "#60a5fa", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none", whiteSpace: "nowrap",
                                        }}
                                    >
                                        <ExternalLink style={{ width: 15, height: 15 }} />
                                        View Full
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
