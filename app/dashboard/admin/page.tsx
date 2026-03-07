"use client";
import { useState, useEffect } from "react";
import { Users, Droplets, AlertTriangle, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";

const DonorMap = dynamic(() => import("@/components/maps/DonorMap"), { ssr: false });

export default function AdminDashboard() {
    const [stats, setStats] = useState({ donors: 0, requests: 0, inventory: 0, pendingNid: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                const json = await res.json();
                if (json.success) {
                    setStats(json.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    return (
        <div>
            <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
                <h1 style={{ fontSize: "1.625rem", fontWeight: 700, marginBottom: "0.375rem" }}>Mission Control</h1>
                <p style={{ color: "var(--text-muted)" }}>Global overview of platform activity, inventory, and verifications.</p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--text-muted)" }}>Loading metrics…</div>
            ) : (
                <>
                    <div className="grid-4" style={{ marginBottom: "2rem" }}>
                        <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "rgba(59,130,246,0.2)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--info)" }}>
                                <Users className="w-5 h-5" /> Total Donors
                            </div>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{stats.donors}</div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>+12 this week</p>
                        </div>

                        <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "rgba(245,158,11,0.2)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--warning)" }}>
                                <AlertTriangle className="w-5 h-5" /> Active Requests
                            </div>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{stats.requests}</div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>3 STAT emergencies</p>
                        </div>

                        <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "rgba(230,57,70,0.2)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--primary)" }}>
                                <Droplets className="w-5 h-5" /> Blood Units
                            </div>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{stats.inventory}</div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>Safe operating levels</p>
                        </div>

                        <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left", borderColor: "rgba(168,85,247,0.2)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "#c084fc" }}>
                                <ShieldCheck className="w-5 h-5" /> Pending NID
                            </div>
                            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{stats.pendingNid}</div>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>Requires review</p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
                        <div className="glass" style={{ padding: "1.75rem" }}>
                            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Urgency Feed (Live)</h2>
                            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                                <ActivityIcon />
                                <p style={{ marginTop: "0.5rem" }}>Connecting to realtime feed…</p>
                            </div>
                        </div>

                        <div className="glass" style={{ padding: "1.75rem" }}>
                            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>NID Verification Queue</h2>
                            <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
                                <ShieldCheck className="w-8 h-8 mx-auto mb-2" style={{ opacity: 0.3 }} />
                                <p>{stats.pendingNid} documents waiting for approval</p>
                                <a
                                    href="/dashboard/admin/nid"
                                    style={{
                                        display: "inline-block",
                                        marginTop: "0.75rem",
                                        color: "var(--info)",
                                        fontSize: "0.875rem",
                                        border: "1px solid rgba(59,130,246,0.3)",
                                        borderRadius: "var(--radius-sm)",
                                        padding: "0.375rem 1rem",
                                    }}
                                >
                                    Review Queue
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="glass" style={{ marginTop: "1.5rem", padding: "1.75rem" }}>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem" }}>Live Donor Map (Dhaka Cantonment)</h2>
                        <DonorMap />
                    </div>
                </>
            )}
        </div>
    );
}

function ActivityIcon() {
    return (
        <svg className="w-8 h-8 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}
