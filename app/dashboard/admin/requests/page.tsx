"use client";
import { useState, useEffect, useCallback } from "react";
import { CheckCircle2, Droplets, ChevronDown } from "lucide-react";

type UrgencyLevel = "Routine" | "Urgent" | "STAT";
type RequestStatus = "Pending" | "Approved" | "InTransit" | "Fulfilled" | "Cancelled";

interface Request {
    _id: string;
    patientName: string;
    hospitalName: string;
    bloodGroup: string;
    unitsRequired: number;
    urgency: UrgencyLevel;
    status: RequestStatus;
    reason: string;
    createdAt: string;
}

const URGENCY_COLOR: Record<UrgencyLevel, { bg: string; border: string; text: string }> = {
    STAT:    { bg: "rgba(239,68,68,0.15)",  border: "rgba(239,68,68,0.35)",  text: "#f87171" },
    Urgent:  { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.3)",  text: "#fbbf24" },
    Routine: { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)", text: "#4ade80" },
};

const STATUS_COLOR: Record<RequestStatus, { bg: string; border: string; text: string }> = {
    Pending:   { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)",  text: "#fbbf24" },
    Approved:  { bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)", text: "#60a5fa" },
    InTransit: { bg: "rgba(167,139,250,0.1)", border: "rgba(167,139,250,0.25)", text: "#a78bfa" },
    Fulfilled: { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)", text: "#4ade80" },
    Cancelled: { bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", text: "var(--text-faint)" },
};

function Badge({ label, colors }: { label: string; colors: { bg: string; border: string; text: string } }) {
    return (
        <span style={{ padding: "0.2rem 0.625rem", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, whiteSpace: "nowrap" }}>
            {label}
        </span>
    );
}

export default function AdminRequestsPage() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("");
    const [urgencyFilter, setUrgencyFilter] = useState("");
    const [page, setPage] = useState(1);
    const pages = Math.ceil(total / 20);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (statusFilter)  params.set("status",  statusFilter);
            if (urgencyFilter) params.set("urgency", urgencyFilter);
            const res  = await fetch(`/api/requests?${params}`);
            const json = await res.json();
            if (json.success) {
                setRequests(json.data.requests);
                setTotal(json.data.total);
            }
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, urgencyFilter]);

    useEffect(() => { fetchRequests(); }, [fetchRequests]);

    const filterStyle: React.CSSProperties = {
        background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "var(--radius-sm)", padding: "0.5rem 0.875rem", fontSize: "0.8375rem",
        color: "#e2e8f0", cursor: "pointer", appearance: "none" as const,
    };

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 0 3rem" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Droplets style={{ width: 22, height: 22, color: "#fbbf24" }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)", fontWeight: 700, lineHeight: 1.2 }}>Blood Requests</h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.2rem" }}>All platform blood requests — {total} total</p>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}>
                    <div style={{ position: "relative" }}>
                        <select value={urgencyFilter} onChange={e => { setUrgencyFilter(e.target.value); setPage(1); }} style={filterStyle}>
                            <option value="" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>All Urgency</option>
                            <option value="STAT" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>STAT</option>
                            <option value="Urgent" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>Urgent</option>
                            <option value="Routine" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>Routine</option>
                        </select>
                        <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "var(--text-faint)", pointerEvents: "none" }} />
                    </div>
                    <div style={{ position: "relative" }}>
                        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={filterStyle}>
                            <option value="" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>All Status</option>
                            <option value="Pending" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="InTransit">In Transit</option>
                            <option value="Approved" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>Approved</option>
                            <option value="InTransit" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>In Transit</option>
                            <option value="Fulfilled" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>Fulfilled</option>
                            <option value="Cancelled" style={{ background: "#1a1a2e", color: "#e2e8f0" }}>Cancelled</option>
                        </select>
                        <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "var(--text-faint)", pointerEvents: "none" }} />
                    </div>
                </div>
            </div>

            {/* Table */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[1,2,3,4].map(i => (
                        <div key={i} className="glass" style={{ padding: "1.25rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                            <div style={{ flex: 1, height: 14, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ width: 80, height: 14, borderRadius: 6, background: "rgba(255,255,255,0.04)" }} />
                        </div>
                    ))}
                </div>
            ) : requests.length === 0 ? (
                <div className="glass" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <CheckCircle2 style={{ width: 36, height: 36, color: "#4ade80", margin: "0 auto 1rem", opacity: 0.5 }} />
                    <p style={{ color: "var(--text-muted)" }}>No requests match the current filters.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {requests.map(req => (
                        <div key={req._id} className="glass" style={{ padding: "1.125rem 1.5rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>

                            {/* Blood group badge */}
                            <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)" }}>
                                {req.bloodGroup}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.25rem" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.9375rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.patientName}</span>
                                    <Badge label={req.urgency} colors={URGENCY_COLOR[req.urgency]} />
                                </div>
                                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{req.hospitalName} · {req.unitsRequired} unit{req.unitsRequired !== 1 ? "s" : ""}</p>
                            </div>

                            {/* Status + date */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.35rem", flexShrink: 0 }}>
                                <Badge label={req.status} colors={STATUS_COLOR[req.status]} />
                                <span style={{ fontSize: "0.7375rem", color: "var(--text-faint)" }}>
                                    {new Date(req.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "1.75rem", flexWrap: "wrap" }}>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: page === 1 ? "var(--text-faint)" : "var(--text)", cursor: page === 1 ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>
                        ← Prev
                    </button>
                    <span style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                        {page} / {pages}
                    </span>
                    <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                        style={{ padding: "0.5rem 1rem", borderRadius: "var(--radius-sm)", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: page === pages ? "var(--text-faint)" : "var(--text)", cursor: page === pages ? "not-allowed" : "pointer", fontSize: "0.875rem" }}>
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}
