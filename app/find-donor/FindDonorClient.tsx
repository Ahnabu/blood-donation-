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
    const [district, setDistrict] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SearchState | null>(null);
    const [searched, setSearched] = useState(false);

    const search = useCallback(async (bg: string, dist: string, page = 1) => {
        setLoading(true);
        setSearched(true);
        const params = new URLSearchParams({ page: String(page), limit: "12" });
        if (bg) params.set("bloodGroup", bg);
        if (dist) params.set("district", dist);

        const res = await fetch(`/api/donors?${params}`);
        const json = await res.json();
        if (json.success) setResult(json.data);
        setLoading(false);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        search(bloodGroup, district);
    };

    return (
        <div>
            {/* Search form */}
            <form onSubmit={handleSubmit} className="glass" style={{ padding: "2rem", marginBottom: "2rem", maxWidth: 640, margin: "0 auto 2rem" }}>
                <div className="grid-3" style={{ gridTemplateColumns: "1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Blood Group</label>
                        <select
                            className="input"
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            id="blood-group-select"
                        >
                            <option value="">All groups</option>
                            {BLOOD_GROUPS.slice(1).map((bg) => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">District</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g. Dhaka"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            id="district-input"
                        />
                    </div>

                    <button type="submit" className="btn-primary" id="search-donors-btn" style={{ height: 44, padding: "0 1.25rem" }}>
                        <Search className="w-4 h-4" />
                        Search
                    </button>
                </div>
            </form>

            {/* Results */}
            {loading && (
                <div className="text-center text-gray-400 py-16">
                    <Droplets className="w-10 h-10 text-red-500 mx-auto mb-4 animate-pulse" />
                    <p>Searching donors...</p>
                </div>
            )}

            {!loading && searched && result && (
                <>
                    <p className="text-gray-400 text-sm mb-6 text-center">
                        Found <strong className="text-white">{result.total}</strong> donor{result.total !== 1 ? "s" : ""}
                        {bloodGroup ? ` with blood group ${bloodGroup}` : ""}
                        {district ? ` in ${district}` : ""}
                    </p>

                    {result.donors.length === 0 ? (
                        <div className="text-center py-16 glass" style={{ borderRadius: 12 }}>
                            <p className="text-gray-400">No donors found matching your criteria.</p>
                            <p className="text-sm text-gray-500 mt-2">Try broadening your search or check back later.</p>
                        </div>
                    ) : (
                        <div className="grid-auto">
                            {result.donors.map((donor) => (
                                <div key={donor._id} className="glass" style={{ padding: "1.5rem" }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span
                                            className="badge"
                                            style={{
                                                background: `${BLOOD_GROUP_COLORS[donor.bloodGroup]}20`,
                                                color: BLOOD_GROUP_COLORS[donor.bloodGroup],
                                                border: `1px solid ${BLOOD_GROUP_COLORS[donor.bloodGroup]}40`,
                                                fontSize: "1.1rem",
                                            }}
                                        >
                                            {donor.bloodGroup}
                                        </span>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <span>{donor.totalDonations} donations</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                                        <MapPin className="w-3.5 h-3.5" />
                                        {donor.district}
                                    </div>

                                    {/* Reliability bar */}
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                            <span>Reliability</span>
                                            <span>{donor.reliabilityScore}%</span>
                                        </div>
                                        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)" }}>
                                            <div
                                                style={{
                                                    height: "100%",
                                                    borderRadius: 2,
                                                    width: `${donor.reliabilityScore}%`,
                                                    background: "linear-gradient(90deg, #dc2626, #ef4444)",
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
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: result.pages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => search(bloodGroup, district, p)}
                                    className={p === result.page ? "btn-primary" : "btn-secondary"}
                                    style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}

            {!searched && (
                <div className="text-center py-16 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Select a blood group or district and click Search to find donors.</p>
                </div>
            )}
        </div>
    );
}
