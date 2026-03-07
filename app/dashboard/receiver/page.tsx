"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Activity, Clock, CheckCircle } from "lucide-react";
import { STATUS_STEPS, getStatusIndex, URGENCY_CONFIG } from "@/lib/utils";

export default function ReceiverDashboard() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRequests() {
            const res = await fetch("/api/requests");
            const json = await res.json();
            if (json.success) setRequests(json.data.requests);
            setLoading(false);
        }
        fetchRequests();
    }, []);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                    <h1 style={{ fontSize: "1.625rem", fontWeight: 700, marginBottom: "0.375rem" }}>My Requests</h1>
                    <p style={{ color: "var(--text-muted)" }}>Track and manage your blood requests.</p>
                </div>
                <Link href="/dashboard/receiver/new" className="btn-primary">
                    <Plus className="w-4 h-4" /> New Request
                </Link>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--text-muted)" }}>Loading requests…</div>
            ) : requests.length === 0 ? (
                <div className="glass" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <Activity className="w-12 h-12 mx-auto mb-4" style={{ opacity: 0.3, color: "var(--text-muted)" }} />
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.5rem" }}>No active requests</h3>
                    <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>You haven&apos;t made any blood requests yet.</p>
                    <Link href="/dashboard/receiver/new" className="btn-secondary">
                        Request Blood Now
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                    {requests.map(req => {
                        const urgency = URGENCY_CONFIG[req.urgency as keyof typeof URGENCY_CONFIG];
                        const currentIndex = getStatusIndex(req.status);

                        return (
                            <div key={req._id} className="glass" style={{ padding: "1.75rem", borderLeft: `4px solid ${urgency.color}` }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", paddingBottom: "1.25rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: "1rem" }}>
                                    <div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.625rem", flexWrap: "wrap" }}>
                                            <span className="badge badge-red" style={{ fontSize: "0.9rem" }}>{req.bloodGroup}</span>
                                            <span className={`badge ${urgency.bg} ${urgency.border}`} style={{ color: urgency.color }}>
                                                {urgency.label}
                                            </span>
                                        </div>
                                        <h3 style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.25rem" }}>{req.patientName}</h3>
                                        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>{req.hospitalName}</p>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: "1.75rem", fontWeight: 800 }}>
                                            {req.unitsNeeded}{" "}
                                            <span style={{ fontSize: "0.875rem", fontWeight: 400, color: "var(--text-muted)" }}>units</span>
                                        </div>
                                        <div style={{ fontSize: "0.75rem", color: "var(--text-faint)", marginTop: "0.25rem" }}>Needed by {new Date(req.neededBy).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                <div style={{ padding: "1rem 0" }}>
                                    <div className="status-track">
                                        {STATUS_STEPS.map((step, idx) => (
                                            <div key={step} className={`status-step ${idx < currentIndex ? "done" : idx === currentIndex ? "active" : ""}`}>
                                                <div className="step-dot flex items-center justify-center">
                                                    {idx < currentIndex && <CheckCircle className="w-3 h-3 text-white" />}
                                                </div>
                                                <span style={{ fontSize: "0.72rem", marginTop: "0.5rem", fontWeight: 500, color: idx <= currentIndex ? "var(--text)" : "var(--text-faint)" }}>
                                                    {step}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {req.status === "Pending" && (
                                    <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end" }}>
                                        <button style={{ fontSize: "0.875rem", color: "var(--primary-light)", background: "none", border: "none", cursor: "pointer" }}>Cancel Request</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
