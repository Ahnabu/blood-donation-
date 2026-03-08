"use client";
import { useState, useEffect, useCallback } from "react";
import { Users, Droplets, AlertTriangle, ShieldCheck, RefreshCw, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const DonorMap = dynamic(() => import("@/components/maps/DonorMap"), { ssr: false });

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface StatsData {
    donors: number;
    donorsThisWeek: number;
    requests: number;
    statRequests: number;
    inventory: number;
    inventoryByGroup: Record<string, number>;
    pendingNid: number;
    recentRequests: {
        _id: string;
        patientName: string;
        bloodGroup: string;
        urgency: string;
        status: string;
        hospitalName: string;
        createdAt: string;
    }[];
    newUsersThisMonth: number;
    fulfilledRequests: number;
}

const URGENCY_COLOR: Record<string, string> = {
    STAT: "#f87171",
    Urgent: "#fbbf24",
    Routine: "#4ade80",
};

const STATUS_COLOR: Record<string, string> = {
    Pending: "#fbbf24",
    Approved: "#4ade80",
    InTransit: "#60a5fa",
    Fulfilled: "#a3e635",
    Cancelled: "#f87171",
};

function SkeletonBox({ w, h }: { w?: string | number; h?: string | number }) {
    return (
        <div style={{
            width: w ?? "100%", height: h ?? 20,
            borderRadius: 6, background: "rgba(255,255,255,0.06)",
            animation: "pulse 1.6s ease-in-out infinite",
        }} />
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [lastFetched, setLastFetched] = useState<Date | null>(null);

    const fetchStats = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        else setRefreshing(true);
        try {
            const res = await fetch("/api/admin/stats");
            const json = await res.json();
            if (json.success) {
                setStats(json.data);
                setLastFetched(new Date());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                    <div style={{ fontSize: "1.625rem", fontWeight: 700, marginBottom: "0.375rem", color: "var(--text)" }}>Mission Control</div>
                    <p style={{ color: "var(--text-muted)" }}>Global overview of platform activity, inventory, and verifications.</p>
                </div>
                <button
                    onClick={() => fetchStats(true)}
                    disabled={refreshing}
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "0.45rem 1rem", borderRadius: 8,
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "var(--text-muted)", fontSize: "0.8rem",
                        cursor: refreshing ? "not-allowed" : "pointer",
                    }}
                >
                    <RefreshCw style={{ width: 14, height: 14, animation: refreshing ? "spin 1s linear infinite" : "none" }} />
                    {lastFetched ? `Updated ${lastFetched.toLocaleTimeString()}` : "Refresh"}
                </button>
            </div>

            {/* ── Stat Cards ── */}
            <div className="grid-4" style={{ marginBottom: "2rem" }}>
                {/* Total Donors */}
                <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "rgba(59,130,246,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--info)", fontSize: "0.85rem", fontWeight: 600 }}>
                        <Users style={{ width: 18, height: 18, flexShrink: 0 }} /> Total Donors
                    </div>
                    {loading ? <SkeletonBox h={36} w={60} /> : (
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{stats?.donors ?? 0}</div>
                    )}
                    <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                        {loading ? <SkeletonBox h={14} w={80} /> : `+${stats?.donorsThisWeek ?? 0} this week`}
                    </p>
                </div>

                {/* Active Requests */}
                <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "rgba(245,158,11,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--warning)", fontSize: "0.85rem", fontWeight: 600 }}>
                        <AlertTriangle style={{ width: 18, height: 18, flexShrink: 0 }} /> Active Requests
                    </div>
                    {loading ? <SkeletonBox h={36} w={60} /> : (
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{stats?.requests ?? 0}</div>
                    )}
                    <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                        {loading ? <SkeletonBox h={14} w={100} /> : `${stats?.statRequests ?? 0} STAT emergencies`}
                    </p>
                </div>

                {/* Blood Units */}
                <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "rgba(230,57,70,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600 }}>
                        <Droplets style={{ width: 18, height: 18, flexShrink: 0 }} /> Blood Units
                    </div>
                    {loading ? <SkeletonBox h={36} w={60} /> : (
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{stats?.inventory ?? 0}</div>
                    )}
                    <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                        {loading ? <SkeletonBox h={14} w={110} /> : `${stats?.fulfilledRequests ?? 0} requests fulfilled`}
                    </p>
                </div>

                {/* Pending NID */}
                <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "rgba(168,85,247,0.2)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "#c084fc", fontSize: "0.85rem", fontWeight: 600 }}>
                        <ShieldCheck style={{ width: 18, height: 18, flexShrink: 0 }} /> Pending NID
                    </div>
                    {loading ? <SkeletonBox h={36} w={60} /> : (
                        <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{stats?.pendingNid ?? 0}</div>
                    )}
                    <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                        {loading ? <SkeletonBox h={14} w={90} /> : `${stats?.newUsersThisMonth ?? 0} new users this month`}
                    </p>
                </div>
            </div>

            {/* ── Middle Row ── */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>

                {/* Recent Active Requests */}
                <div className="glass" style={{ padding: "1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                        <div style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                            <Clock style={{ width: 16, height: 16, color: "var(--warning)" }} /> Recent Requests
                        </div>
                        <Link href="/dashboard/admin/requests" style={{ fontSize: "0.75rem", color: "var(--info)", textDecoration: "none" }}>View all →</Link>
                    </div>
                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[1,2,3].map(i => <SkeletonBox key={i} h={52} />)}
                        </div>
                    ) : !stats?.recentRequests?.length ? (
                        <div style={{ textAlign: "center", padding: "2rem 1rem", color: "var(--text-faint)", fontSize: "0.875rem" }}>No active requests</div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {stats.recentRequests.map((req) => (
                                <div key={req._id} style={{
                                    padding: "0.75rem",
                                    borderRadius: 8,
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
                                }}>
                                    <div style={{ minWidth: 0 }}>
                                        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {req.patientName}
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-faint)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {req.hospitalName}
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                                        <span style={{
                                            fontSize: "0.7rem", fontWeight: 700,
                                            padding: "2px 7px", borderRadius: 999,
                                            background: `${URGENCY_COLOR[req.urgency]}20`,
                                            color: URGENCY_COLOR[req.urgency],
                                            border: `1px solid ${URGENCY_COLOR[req.urgency]}40`,
                                        }}>{req.urgency}</span>
                                        <span style={{
                                            fontSize: "0.72rem", fontWeight: 700,
                                            padding: "2px 7px", borderRadius: 999,
                                            background: "rgba(230,57,70,0.15)",
                                            color: "#f87171",
                                            border: "1px solid rgba(230,57,70,0.3)",
                                        }}>{req.bloodGroup}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Blood Inventory Breakdown */}
                <div className="glass" style={{ padding: "1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                        <div style={{ fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                            <Droplets style={{ width: 16, height: 16, color: "var(--primary)" }} /> Inventory by Blood Group
                        </div>
                        <Link href="/dashboard/admin/nid" style={{ fontSize: "0.75rem", color: "var(--info)", textDecoration: "none" }}>Manage →</Link>
                    </div>
                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {[1,2,3,4].map(i => <SkeletonBox key={i} h={32} />)}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {BLOOD_GROUPS.map(bg => {
                                const units = stats?.inventoryByGroup?.[bg] ?? 0;
                                const maxUnits = Math.max(...BLOOD_GROUPS.map(g => stats?.inventoryByGroup?.[g] ?? 0), 1);
                                const pct = Math.round((units / maxUnits) * 100);
                                const color = units === 0 ? "#f87171" : units < 3 ? "#fbbf24" : "#4ade80";
                                return (
                                    <div key={bg} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ width: 32, fontSize: "0.75rem", fontWeight: 700, color: "var(--text)", flexShrink: 0, textAlign: "center" }}>{bg}</span>
                                        <div style={{ flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                                            <div style={{ width: `${pct}%`, height: "100%", borderRadius: 4, background: color, transition: "width 0.6s ease" }} />
                                        </div>
                                        <span style={{ width: 28, fontSize: "0.75rem", color: color, fontWeight: 700, flexShrink: 0, textAlign: "right" }}>{units}</span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* NID Queue summary */}
                <div className="glass" style={{ padding: "1.75rem" }}>
                    <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: 8 }}>
                        <ShieldCheck style={{ width: 16, height: 16, color: "#c084fc" }} /> NID Verification Queue
                    </div>
                    <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                        {loading ? <SkeletonBox h={48} w={60} /> : (
                            <>
                                <div style={{ fontSize: "3rem", fontWeight: 800, color: stats?.pendingNid ? "#fbbf24" : "#4ade80", lineHeight: 1, marginBottom: 8 }}>
                                    {stats?.pendingNid ?? 0}
                                </div>
                                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
                                    {stats?.pendingNid ? "document(s) awaiting review" : "All identities verified!"}
                                </p>
                                <Link
                                    href="/dashboard/admin/nid"
                                    className="btn-primary"
                                    style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}
                                >
                                    <CheckCircle2 style={{ width: 14, height: 14 }} />
                                    Review Queue
                                </Link>
                            </>
                        )}
                    </div>
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", marginTop: "0.5rem", display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-faint)" }}>
                        <span>New users this month</span>
                        <span style={{ fontWeight: 700, color: "var(--text-muted)" }}>
                            {loading ? "…" : stats?.newUsersThisMonth ?? 0}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Platform Summary Row ── */}
            {!loading && stats && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                    {[
                        { label: "Total Donors", value: stats.donors, icon: Users, color: "var(--info)" },
                        { label: "New This Month", value: stats.newUsersThisMonth, icon: TrendingUp, color: "#34d399" },
                        { label: "Fulfilled Requests", value: stats.fulfilledRequests, icon: CheckCircle2, color: "#4ade80" },
                        { label: "STAT Emergencies", value: stats.statRequests, icon: AlertTriangle, color: "#f87171" },
                    ].map(({ label, value, icon: Icon, color }) => (
                        <div key={label} style={{
                            padding: "1rem 1.25rem",
                            borderRadius: 10,
                            background: "rgba(255,255,255,0.02)",
                            border: "1px solid rgba(255,255,255,0.06)",
                            display: "flex", alignItems: "center", gap: 12,
                        }}>
                            <Icon style={{ width: 22, height: 22, color, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: "1.375rem", fontWeight: 800, color: "var(--text)", lineHeight: 1 }}>{value}</div>
                                <div style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginTop: 2 }}>{label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── Donor Map ── */}
            <div className="glass" style={{ padding: "1.75rem" }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Live Donor Map (Dhaka Cantonment)</div>
                <DonorMap />
            </div>
        </div>
    );
}
