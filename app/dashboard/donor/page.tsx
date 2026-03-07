"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Clock, Activity, Calendar, Droplets, Heart, MapPin, ChevronRight, AlertCircle } from "lucide-react";
import { daysUntil, URGENCY_CONFIG } from "@/lib/utils";

export default function DonorDashboard() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<any[]>([]);
    const [reqLoading, setReqLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        async function fetchProfile() {
            try {
                const res = await fetch("/api/donors/me");
                const json = await res.json();
                if (json.success && json.data) {
                    setProfile({
                        bloodGroup: json.data.bloodGroup,
                        totalDonations: json.data.totalDonations || 0,
                        lastDonated: json.data.lastDonated || new Date("2020-01-01").toISOString(),
                        nextEligibleDate: getNextEligibleDate(json.data.lastDonated),
                    });
                } else {
                    // Fallback to empty if not fully set up
                    setProfile({ bloodGroup: "N/A", totalDonations: 0, nextEligibleDate: new Date().toISOString() });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        async function fetchRequests() {
            try {
                const res = await fetch("/api/requests?status=Pending&limit=5");
                const json = await res.json();
                if (json.success) setRequests(json.data.requests || []);
            } catch (err) {
                console.error(err);
            } finally {
                setReqLoading(false);
            }
        }

        fetchProfile();
        fetchRequests();
    }, [session]);

    function getNextEligibleDate(lastDonated?: string | Date) {
        if (!lastDonated) return new Date().toISOString();
        const nextDate = new Date(lastDonated);
        nextDate.setDate(nextDate.getDate() + 90); // Next eligible in 90 days roughly
        return nextDate.toISOString();
    }

    if (loading) return (
        <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--text-muted)" }}>Loading donor profile…</div>
    );

    const daysToEligible = daysUntil(profile.nextEligibleDate);
    const isEligible = daysToEligible === 0;

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.625rem", fontWeight: 700, marginBottom: "0.5rem" }}>Donor Hub</h1>
                <p style={{ color: "var(--text-muted)" }}>Manage your profile, track your impact, and find donation requests.</p>
            </div>

            <div className="grid-3" style={{ marginBottom: "2rem" }}>
                <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--text-muted)" }}>
                        <Activity className="w-5 h-5" /> Eligibility
                    </div>
                    {isEligible ? (
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--success)", marginBottom: "0.25rem" }}>Eligible to Donate</div>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>You can donate blood today.</p>
                        </div>
                    ) : (
                        <div>
                            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--warning)", marginBottom: "0.25rem" }}>{daysToEligible} Days</div>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>until you can donate again.</p>
                        </div>
                    )}
                </div>

                <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--text-muted)" }}>
                        <Droplets className="w-5 h-5" style={{ color: "var(--primary)" }} /> Blood Group
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{profile.bloodGroup}</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>Your blood type</p>
                </div>

                <div className="stat-card" style={{ padding: "1.5rem", textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", color: "var(--text-muted)" }}>
                        <Calendar className="w-5 h-5" /> Total Donations
                    </div>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", marginBottom: "0.25rem" }}>{profile.totalDonations}</div>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>Lives impacted: ~{profile.totalDonations * 3}</p>
                </div>
            </div>

            {/* Donate / Need Blood Action Banner */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
                <div className="glass" style={{ padding: "1.75rem", border: "1px solid rgba(230,57,70,0.25)", background: "rgba(230,57,70,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
                        <Heart style={{ color: "var(--primary)", width: 22, height: 22 }} />
                        <h3 style={{ fontWeight: 700, fontSize: "1.05rem" }}>Ready to Donate?</h3>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                        {isEligible ? "You are eligible today. Browse urgent requests and save a life." : `You can donate again in ${daysToEligible} day${daysToEligible !== 1 ? "s" : ""}.`}
                    </p>
                    <Link href="/find-donor" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <MapPin style={{ width: 15, height: 15 }} /> Find Requests Near You
                    </Link>
                </div>

                <div className="glass" style={{ padding: "1.75rem", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
                        <AlertCircle style={{ color: "var(--warning)", width: 22, height: 22 }} />
                        <h3 style={{ fontWeight: 700, fontSize: "1.05rem" }}>Need Blood?</h3>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.25rem" }}>
                        If you or someone you know needs blood urgently, submit a request to be matched with donors.
                    </p>
                    <Link href="/register?role=receiver" className="btn-secondary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                        <ChevronRight style={{ width: 15, height: 15 }} /> Request as Receiver
                    </Link>
                </div>
            </div>

            {/* Open Blood Requests */}
            <div className="glass" style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Open Blood Requests</h2>
                    <Link href="/find-donor" style={{ fontSize: "0.85rem", color: "var(--primary)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                        View all <ChevronRight style={{ width: 14, height: 14 }} />
                    </Link>
                </div>

                {reqLoading ? (
                    <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>Loading requests…</div>
                ) : requests.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                        <p>No open requests at the moment.</p>
                        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "var(--text-faint)" }}>We will notify you when there is an urgent need for {profile.bloodGroup}.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                        {requests.map((req) => {
                            const urgency = URGENCY_CONFIG[req.urgency as keyof typeof URGENCY_CONFIG] ?? URGENCY_CONFIG.Routine;
                            return (
                                <div key={req._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: "0.75rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                                        <span className="badge badge-red" style={{ fontSize: "0.9rem", minWidth: 40, textAlign: "center" }}>{req.bloodGroup}</span>
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.2rem" }}>{req.patientName}</div>
                                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{req.hospitalName}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: urgency.color, background: `${urgency.color}18`, padding: "0.2rem 0.6rem", borderRadius: "999px", border: `1px solid ${urgency.color}44` }}>{urgency.label}</span>
                                        <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>{req.unitsNeeded ?? req.unitsRequired} units</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
