"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Plus, Activity, Clock, CheckCircle, Heart, ChevronRight, Users, Phone, Droplets, MapPin, Star } from "lucide-react";
import { STATUS_STEPS, getStatusIndex, URGENCY_CONFIG } from "@/lib/utils";

interface DonorResult {
    _id: string;
    bloodGroup: string;
    area?: string;
    lastDonated?: string;
    totalDonations: number;
    reliabilityScore: number;
    isAvailable: boolean;
    userId: { name: string; phone?: string };
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}yr ago`;
}

function MatchedDonors({ bloodGroups }: { bloodGroups: string[] }) {
    const [donors, setDonors] = useState<DonorResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState(bloodGroups[0] ?? "");

    useEffect(() => {
        if (!selectedGroup) { setLoading(false); return; }
        setLoading(true);
        fetch(`/api/donors/for-receiver?bloodGroup=${encodeURIComponent(selectedGroup)}&limit=12`)
            .then(r => r.json())
            .then(j => { if (j.success) setDonors(j.data.donors); })
            .finally(() => setLoading(false));
    }, [selectedGroup]);

    return (
        <div className="glass" style={{ padding: "1.75rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Users style={{ width: 20, height: 20, color: "#4ade80" }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: "1rem" }}>Available Donors</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Donors matching your blood type request</div>
                    </div>
                </div>
                {bloodGroups.length > 1 && (
                    <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                        {bloodGroups.map(bg => (
                            <button key={bg} onClick={() => setSelectedGroup(bg)}
                                style={{ padding: "0.3rem 0.75rem", borderRadius: 999, fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", border: "1px solid", background: selectedGroup === bg ? "rgba(230,57,70,0.2)" : "transparent", borderColor: selectedGroup === bg ? "rgba(230,57,70,0.5)" : "rgba(255,255,255,0.12)", color: selectedGroup === bg ? "var(--primary)" : "var(--text-faint)" }}>
                                {bg}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px,100%), 1fr))", gap: "0.75rem" }}>
                    {[1,2,3].map(i => (
                        <div key={i} style={{ padding: "1rem", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.03)", height: 110, animation: "pulse 1.6s ease-in-out infinite" }} />
                    ))}
                </div>
            ) : donors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    No available donors found for blood group <strong>{selectedGroup}</strong> right now.
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px,100%), 1fr))", gap: "0.75rem" }}>
                    {donors.map(d => (
                        <div key={d._id} style={{ padding: "1.125rem", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontWeight: 700, fontSize: "0.9375rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, minWidth: 0, marginRight: "0.5rem" }}>{d.userId?.name ?? "Donor"}</span>
                                <span style={{ padding: "0.15rem 0.5rem", borderRadius: 999, fontSize: "0.7rem", fontWeight: 800, background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.25)", color: "var(--primary)", flexShrink: 0 }}>{d.bloodGroup}</span>
                            </div>
                            {d.userId?.phone && (
                                <a href={`tel:${d.userId.phone}`} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.8125rem", color: "#60a5fa", textDecoration: "none" }}>
                                    <Phone style={{ width: 12, height: 12, flexShrink: 0 }} />{d.userId.phone}
                                </a>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.875rem", fontSize: "0.76rem", color: "var(--text-faint)", flexWrap: "wrap" }}>
                                {d.area && <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin style={{ width: 10, height: 10 }} />{d.area}</span>}
                                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Droplets style={{ width: 10, height: 10 }} />{d.totalDonations} donation{d.totalDonations !== 1 ? "s" : ""}</span>
                                {d.lastDonated && <span>Last: {timeAgo(d.lastDonated)}</span>}
                                <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Star style={{ width: 10, height: 10, color: "#fbbf24" }} />{d.reliabilityScore}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.125rem" }}>
                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: d.isAvailable ? "#4ade80" : "#f87171", flexShrink: 0 }} />
                                <span style={{ fontSize: "0.72rem", color: d.isAvailable ? "#4ade80" : "#f87171", fontWeight: 600 }}>{d.isAvailable ? "Available" : "Unavailable"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function ReceiverDashboard() {
    const { data: session } = useSession();
    // @ts-expect-error custom fields
    const nidStatus = session?.user?.nidStatus as string | undefined;

    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading]   = useState(true);

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

            {/* Become a Donor Banner */}
            <div className="glass" style={{ padding: "1.5rem 1.75rem", marginBottom: "2rem", border: "1px solid rgba(230,57,70,0.2)", background: "rgba(230,57,70,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(230,57,70,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Heart style={{ color: "var(--primary)", width: 22, height: 22 }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "0.2rem" }}>Want to save lives too?</div>
                        <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Register as a blood donor and help others in need when you are able.</div>
                    </div>
                </div>
                <Link href="/register?role=donor" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap" }}>
                    <Heart style={{ width: 15, height: 15 }} /> Become a Donor <ChevronRight style={{ width: 14, height: 14 }} />
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

            {/* Matched donors — only for verified receivers */}
            {nidStatus === "approved" && !loading && requests.length > 0 && (() => {
                const bloodGroups = [...new Set(
                    requests
                        .filter(r => r.status !== "Cancelled" && r.status !== "Fulfilled")
                        .map((r: any) => r.bloodGroup as string)
                        .filter(Boolean)
                )];
                return bloodGroups.length > 0 ? <MatchedDonors bloodGroups={bloodGroups} /> : null;
            })()}
        </div>
    );
}
