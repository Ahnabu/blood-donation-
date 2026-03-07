"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Clock, Activity, Calendar, Droplets } from "lucide-react";
import { daysUntil } from "@/lib/utils";

export default function DonorDashboard() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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

        fetchProfile();
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

            <div className="glass" style={{ padding: "1.75rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1.25rem" }}>Nearby Urgent Requests</h2>
                {isEligible ? (
                    <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                        <p>No urgent requests for {profile.bloodGroup} in your area right now.</p>
                        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "var(--text-faint)" }}>We will notify you immediately when there is a match.</p>
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: "2.5rem 1rem", color: "var(--text-muted)" }}>
                        <p>You are currently in your waiting period.</p>
                        <p style={{ fontSize: "0.875rem", marginTop: "0.5rem", color: "var(--text-faint)" }}>Requests will reappear here once you are eligible to donate again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
