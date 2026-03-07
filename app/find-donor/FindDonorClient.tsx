"use client";
import { useState, useCallback } from "react";
import { Search, MapPin, Droplets } from "lucide-react";
import { BLOOD_GROUP_COLORS } from "@/lib/utils";

const BLOOD_GROUPS = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface Donor {
    _id: string;
    bloodGroup: string;
    district: string;
    totalDonations: number;
    reliabilityScore: number;
}

interface SearchState {
    donors: Donor[];
    total: number;
    pages: number;
    page: number;
}

export default function FindDonorClient() {
    const [bloodGroup, setBloodGroup] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SearchState | null>(null);
    const [searched, setSearched] = useState(false);

    const search = useCallback(async (bg: string, page = 1) => {
        setLoading(true);
        setSearched(true);
        const params = new URLSearchParams({ page: String(page), limit: "12", district: "Dhaka Cantonment" });
        if (bg) params.set("bloodGroup", bg);

        const res = await fetch(`/api/donors?${params}`);
        const json = await res.json();
        if (json.success) setResult(json.data);
        setLoading(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        search(bloodGroup);
    };

    return (
        <div>
            {/* Search form */}
            <div className="glass" style={{ padding: "clamp(1.25rem, 4vw, 2rem)", marginBottom: "2.5rem", maxWidth: 640, margin: "0 auto 2.5rem" }}>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-faint)", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <MapPin style={{ width: 13, height: 13, flexShrink: 0 }} />
                    Showing donors in Dhaka Cantonment Area
                </p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="blood-group-select" style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                        Select Blood Group
                    </label>
                    <div style={{ display: "flex", gap: "0.75rem", alignItems: "stretch" }}>
                        <select
                            id="blood-group-select"
                            className="input"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            style={{ flex: 1 }}
                        >
                            <option value="">All blood groups</option>
                            {BLOOD_GROUPS.slice(1).map((bg) => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                        <button
                            type="submit"
                            className="btn-primary"
                            id="search-donors-btn"
                            style={{ padding: "0 1.5rem", whiteSpace: "nowrap", flexShrink: 0 }}
                        >
                            <Search style={{ width: 16, height: 16 }} />
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Results */}
            {loading && (
                <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--text-muted)" }}>
                    <Droplets style={{ width: 40, height: 40, margin: "0 auto 1rem", color: "var(--primary)", display: "block" }} className="animate-pulse" />
                    <p>Searching donors…</p>
                </div>
            )}

            {!loading && searched && result && (
                <>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1.5rem", textAlign: "center" }}>
                        Found <strong style={{ color: "var(--text)" }}>{result.total}</strong> donor{result.total !== 1 ? "s" : ""}
                        {bloodGroup ? ` with blood group ${bloodGroup}` : ""}
                        {" "}in Dhaka Cantonment
                    </p>

                    {result.donors.length === 0 ? (
                        <div className="glass" style={{ borderRadius: "var(--radius)", textAlign: "center", padding: "5rem 2rem" }}>
                            <p style={{ color: "var(--text-muted)" }}>No donors found matching your criteria.</p>
                            <p style={{ fontSize: "0.875rem", color: "var(--text-faint)", marginTop: "0.5rem" }}>Try broadening your search or check back later.</p>
                        </div>
                    ) : (
                        <div className="grid-auto">
                            {result.donors.map((donor) => (
                                <div key={donor._id} className="glass" style={{ padding: "1.5rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                        <span
                                            className="badge"
                                            style={{
                                                background: `${BLOOD_GROUP_COLORS[donor.bloodGroup]}22`,
                                                color: BLOOD_GROUP_COLORS[donor.bloodGroup],
                                                border: `1px solid ${BLOOD_GROUP_COLORS[donor.bloodGroup]}44`,
                                                fontSize: "0.9rem",
                                            }}
                                        >
                                            {donor.bloodGroup}
                                        </span>
                                        <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                                            {donor.totalDonations} donation{donor.totalDonations !== 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                                        <MapPin className="w-3.5 h-3.5" />
                                        {donor.district}
                                    </div>

                                    {/* Reliability bar */}
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-faint)", marginBottom: "0.375rem" }}>
                                            <span>Reliability</span>
                                            <span>{donor.reliabilityScore}%</span>
                                        </div>
                                        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.07)" }}>
                                            <div
                                                style={{
                                                    height: "100%",
                                                    borderRadius: 2,
                                                    width: `${donor.reliabilityScore}%`,
                                                    background: "linear-gradient(90deg, var(--primary-dark), var(--primary))",
                                                    transition: "width 0.6s ease",
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {result.pages > 1 && (
                        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
                            {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => search(bloodGroup, p)}
                                    className={p === result.page ? "btn-primary" : "btn-secondary"}
                                    style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", minHeight: "44px" }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {!searched && (
                <div style={{ textAlign: "center", padding: "5rem 1rem", color: "var(--text-faint)" }}>
                    <Search style={{ width: 48, height: 48, margin: "0 auto 1rem", opacity: 0.2, display: "block" }} />
                    <p style={{ fontWeight: 500, marginBottom: "0.375rem" }}>Ready to search</p>
                    <p style={{ fontSize: "0.875rem" }}>Select a blood group above and click Search to find donors.</p>
                </div>
            )}
        </div>
    );
}
