"use client";
import { useState, useEffect, useCallback } from "react";
import { Users, Search, ChevronDown, ShieldCheck, AlertCircle, Mail, Phone, X, Droplets, MapPin, Calendar, Activity, Star, Heart, ClipboardList } from "lucide-react";

interface AppUser {
    _id: string;
    name: string;
    email: string;
    role: "donor" | "receiver" | "admin";
    bloodGroup?: string;
    phone?: string;
    dateOfBirth?: string;
    causeOfNeed?: string;
    nidStatus: string;
    verified: boolean;
    createdAt: string;
}

interface DonorProfile {
    bloodGroup: string;
    area?: string;
    age?: number;
    weight?: number;
    lastDonated?: string;
    nextEligibleDate?: string;
    totalDonations: number;
    reliabilityScore: number;
    isAvailable: boolean;
    location?: { coordinates: [number, number] };
    medicalHistory?: {
        hasChronicCondition: boolean;
        chronicConditionDetails?: string;
        recentTattoo: boolean;
        recentAntibiotics: boolean;
        malariaExposure: boolean;
        isPregnant: boolean;
        recentTransfusion: boolean;
    };
}

interface FullProfile {
    user: AppUser;
    donorProfile: DonorProfile | null;
    requestCount: number;
}

const ROLE_COLORS = {
    admin:    { bg: "rgba(230,57,70,0.12)",  border: "rgba(230,57,70,0.3)",   text: "#f87171" },
    donor:    { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)", text: "#4ade80" },
    receiver: { bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)", text: "#60a5fa" },
};

const NID_COLORS: Record<string, { bg: string; border: string; text: string }> = {
    approved: { bg: "rgba(74,222,128,0.1)",  border: "rgba(74,222,128,0.25)", text: "#4ade80" },
    pending:  { bg: "rgba(251,191,36,0.1)",  border: "rgba(251,191,36,0.25)", text: "#fbbf24" },
    rejected: { bg: "rgba(239,68,68,0.12)",  border: "rgba(239,68,68,0.3)",   text: "#f87171" },
    none:     { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", text: "var(--text-faint)" },
};

function Badge({ label, colors }: { label: string; colors: { bg: string; border: string; text: string } }) {
    return (
        <span style={{ padding: "0.2rem 0.625rem", borderRadius: 999, fontSize: "0.7rem", fontWeight: 700, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.text, whiteSpace: "nowrap", textTransform: "capitalize" }}>
            {label}
        </span>
    );
}

function getInitials(name: string) {
    return name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
}

const selectStyle: React.CSSProperties = {
    background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "var(--radius-sm)", padding: "0.5rem 0.875rem", fontSize: "0.8375rem",
    color: "#e2e8f0", cursor: "pointer", appearance: "none",
};

function ProfileModal({ userId, onClose }: { userId: string; onClose: () => void }) {
    const [data, setData] = useState<FullProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/admin/users/${userId}`)
            .then(r => r.json())
            .then(j => { if (j.success) setData(j.data); })
            .finally(() => setLoading(false));
    }, [userId]);

    const u = data?.user;
    const dp = data?.donorProfile;

    return (
        <div
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
        >
            <div
                onClick={e => e.stopPropagation()}
                className="glass"
                style={{ width: "100%", maxWidth: 560, maxHeight: "90vh", overflowY: "auto", borderRadius: "var(--radius)", padding: "2rem", position: "relative" }}
            >
                {/* Close button */}
                <button onClick={onClose} style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "0.35rem", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}>
                    <X style={{ width: 16, height: 16 }} />
                </button>

                {loading || !u ? (
                    <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
                ) : (
                    <>
                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.75rem" }}>
                            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem", color: "#60a5fa", flexShrink: 0 }}>
                                {getInitials(u.name)}
                            </div>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                                    <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>{u.name}</span>
                                    {u.bloodGroup && <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "var(--primary)", background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: 999, padding: "0.1rem 0.45rem" }}>{u.bloodGroup}</span>}
                                </div>
                                <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.4rem", flexWrap: "wrap" }}>
                                    <Badge label={u.role} colors={ROLE_COLORS[u.role] ?? ROLE_COLORS.donor} />
                                    <Badge label={`NID: ${u.nidStatus}`} colors={NID_COLORS[u.nidStatus] ?? NID_COLORS.none} />
                                    {u.verified
                                        ? <span style={{ display:"flex", alignItems:"center", gap:"0.25rem", fontSize:"0.72rem", color:"#4ade80" }}><ShieldCheck style={{ width:13,height:13 }} />Verified</span>
                                        : <span style={{ display:"flex", alignItems:"center", gap:"0.25rem", fontSize:"0.72rem", color:"var(--text-faint)" }}><AlertCircle style={{ width:13,height:13 }} />Not verified</span>}
                                </div>
                            </div>
                        </div>

                        {/* Account info */}
                        <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "var(--radius-sm)", padding: "1.1rem 1.25rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                            <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#60a5fa", marginBottom: "0.3rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Account</p>
                            <Row icon={<Mail style={{ width:13,height:13 }} />} label="Email" value={u.email} />
                            <Row icon={<Phone style={{ width:13,height:13 }} />} label="Phone"
                                value={u.phone || "Not available"} href={u.phone ? `tel:${u.phone}` : undefined} na={!u.phone} />
                            <Row icon={<Calendar style={{ width:13,height:13 }} />} label="Date of Birth"
                                value={u.dateOfBirth ? new Date(u.dateOfBirth).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "Not available"} na={!u.dateOfBirth} />
                            {u.causeOfNeed && <Row icon={<ClipboardList style={{ width:13,height:13 }} />} label="Cause of Need" value={u.causeOfNeed} />}
                            <Row icon={<Calendar style={{ width:13,height:13 }} />} label="Registered" value={new Date(u.createdAt).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })} />
                        </div>

                        {/* Donor profile */}
                        {dp && (
                            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "var(--radius-sm)", padding: "1.1rem 1.25rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                                <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#4ade80", marginBottom: "0.3rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Donor Profile</p>
                                <Row icon={<Droplets style={{ width:13,height:13 }} />} label="Blood Group" value={dp.bloodGroup} />
                                <Row icon={<MapPin style={{ width:13,height:13 }} />} label="Area" value={dp.area || "Not available"} na={!dp.area} />
                                <Row icon={<Activity style={{ width:13,height:13 }} />} label="Age"
                                    value={dp.age ? `${dp.age} yrs` : "Not available"} na={!dp.age} />
                                <Row icon={<Activity style={{ width:13,height:13 }} />} label="Weight"
                                    value={dp.weight ? `${dp.weight} kg` : "Not available"} na={!dp.weight} />
                                <Row icon={<Heart style={{ width:13,height:13 }} />} label="Total Donations" value={String(dp.totalDonations)} />
                                <Row icon={<Star style={{ width:13,height:13 }} />} label="Reliability Score" value={`${dp.reliabilityScore}/100`} />
                                <Row icon={<Calendar style={{ width:13,height:13 }} />} label="Last Donated"
                                    value={dp.lastDonated ? new Date(dp.lastDonated).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "Not available"} na={!dp.lastDonated} />
                                <Row icon={<Calendar style={{ width:13,height:13 }} />} label="Next Eligible"
                                    value={dp.nextEligibleDate ? new Date(dp.nextEligibleDate).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" }) : "Not available"} na={!dp.nextEligibleDate} />
                                <Row icon={<ShieldCheck style={{ width:13,height:13 }} />} label="Available" value={dp.isAvailable ? "Yes" : "No"} />

                                {dp.medicalHistory && (
                                    <div style={{ marginTop: "0.25rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.12)" }}>
                                        <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fbbf24", marginBottom: "0.5rem" }}>Medical History</p>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                                            {[
                                                { label: "Chronic Condition", val: dp.medicalHistory.hasChronicCondition },
                                                { label: "Recent Tattoo",     val: dp.medicalHistory.recentTattoo },
                                                { label: "Recent Antibiotics",val: dp.medicalHistory.recentAntibiotics },
                                                { label: "Malaria Exposure",  val: dp.medicalHistory.malariaExposure },
                                                { label: "Pregnant",          val: dp.medicalHistory.isPregnant },
                                                { label: "Recent Transfusion",val: dp.medicalHistory.recentTransfusion },
                                            ].map(item => (
                                                <span key={item.label} style={{ fontSize: "0.7rem", padding: "0.2rem 0.6rem", borderRadius: 999, border: `1px solid ${item.val ? "rgba(239,68,68,0.45)" : "rgba(255,255,255,0.15)"}`, background: item.val ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.06)", color: item.val ? "#f87171" : "#94a3b8" }}>
                                                    {item.label}: {item.val ? "Yes" : "No"}
                                                </span>
                                            ))}
                                            {dp.medicalHistory.hasChronicCondition && dp.medicalHistory.chronicConditionDetails && (
                                                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", width: "100%", marginTop: "0.15rem" }}>
                                                    Condition: {dp.medicalHistory.chronicConditionDetails}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Receiver requests */}
                        {u.role === "receiver" && (
                            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: "var(--radius-sm)", padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                                <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#60a5fa", marginBottom: "0.3rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>Receiver Info</p>
                                <Row icon={<ClipboardList style={{ width:13,height:13 }} />} label="Blood Requests" value={String(data!.requestCount)} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

function Row({ icon, label, value, href, na }: { icon: React.ReactNode; label: string; value: string; href?: string; na?: boolean }) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
            <span style={{ color: na ? "var(--text-faint)" : "#60a5fa", marginTop: "0.1rem", flexShrink: 0 }}>{icon}</span>
            <span style={{ color: "#94a3b8", fontSize: "0.8rem", minWidth: 130, flexShrink: 0 }}>{label}</span>
            {href
                ? <a href={href} style={{ color: na ? "var(--text-faint)" : "#e2e8f0", fontSize: "0.8rem", fontWeight: na ? 400 : 500, textDecoration: "none", fontStyle: na ? "italic" : "normal" }}>{value}</a>
                : <span style={{ color: na ? "var(--text-faint)" : "#e2e8f0", fontSize: "0.8rem", fontWeight: na ? 400 : 500, fontStyle: na ? "italic" : "normal" }}>{value}</span>}
        </div>
    );
}

export default function AdminUsersPage() {
    const [users, setUsers]     = useState<AppUser[]>([]);
    const [total, setTotal]     = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage]       = useState(1);
    const [roleFilter, setRoleFilter]         = useState("");
    const [nidFilter,  setNidFilter]          = useState("");
    const [bgFilter,   setBgFilter]           = useState("");
    const [search,     setSearch]             = useState("");
    const [searchInput, setSearchInput]       = useState("");
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const pages = Math.ceil(total / 20);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (roleFilter) params.set("role", roleFilter);
            if (nidFilter)  params.set("nidStatus", nidFilter);
            if (bgFilter)   params.set("bloodGroup", bgFilter);
            if (search)     params.set("search", search);
            const res  = await fetch(`/api/admin/users?${params}`);
            const json = await res.json();
            if (json.success) {
                setUsers(json.data.users);
                setTotal(json.data.total);
            }
        } finally {
            setLoading(false);
        }
    }, [page, roleFilter, nidFilter, bgFilter, search]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    function handleSearchSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSearch(searchInput.trim());
        setPage(1);
    }

    return (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 0 3rem" }}>

            {selectedUserId && <ProfileModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}

            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Users style={{ width: 22, height: 22, color: "#60a5fa" }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "clamp(1.375rem,2.5vw,1.75rem)", fontWeight: 700, lineHeight: 1.2 }}>All Users</h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.2rem" }}>{total} registered account{total !== 1 ? "s" : ""}</p>
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: "flex", gap: "0.625rem", flexWrap: "wrap", alignItems: "center" }}>
                    {/* Search */}
                    <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.375rem" }}>
                        <div style={{ position: "relative" }}>
                            <Search style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "var(--text-faint)", pointerEvents: "none" }} />
                            <input
                                type="text"
                                value={searchInput}
                                onChange={e => setSearchInput(e.target.value)}
                                placeholder="Name or email…"
                                style={{ ...selectStyle, paddingLeft: "1.75rem", minWidth: 180 }}
                            />
                        </div>
                        <button type="submit" style={{ ...selectStyle, background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.3)", color: "#60a5fa", padding: "0.5rem 0.75rem", cursor: "pointer" }}>Search</button>
                    </form>

                    <div style={{ position: "relative" }}>
                        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }} style={selectStyle}>
                            <option value="">All Roles</option>
                            <option value="donor">Donor</option>
                            <option value="receiver">Receiver</option>
                            <option value="admin">Admin</option>
                        </select>
                        <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "var(--text-faint)", pointerEvents: "none" }} />
                    </div>

                    <div style={{ position: "relative" }}>
                        <select value={bgFilter} onChange={e => { setBgFilter(e.target.value); setPage(1); }} style={{ ...selectStyle, minWidth: 130 }}>
                            <option value="">All Blood Groups</option>
                            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                                <option key={bg} value={bg}>{bg}</option>
                            ))}
                        </select>
                        <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "var(--text-faint)", pointerEvents: "none" }} />
                    </div>

                    <div style={{ position: "relative" }}>
                        <select value={nidFilter} onChange={e => { setNidFilter(e.target.value); setPage(1); }} style={selectStyle}>
                            <option value="">All NID Status</option>
                            <option value="none">None</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                        <ChevronDown style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", width: 13, height: 13, color: "var(--text-faint)", pointerEvents: "none" }} />
                    </div>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {[1,2,3,4,5].map(i => (
                        <div key={i} className="glass" style={{ padding: "1.125rem 1.5rem", display: "flex", gap: "1rem", alignItems: "center" }}>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                            <div style={{ flex: 1, height: 14, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
                            <div style={{ width: 70, height: 22, borderRadius: 999, background: "rgba(255,255,255,0.04)" }} />
                        </div>
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="glass" style={{ padding: "4rem 2rem", textAlign: "center" }}>
                    <Users style={{ width: 36, height: 36, color: "var(--text-faint)", margin: "0 auto 1rem", opacity: 0.4 }} />
                    <p style={{ color: "var(--text-muted)" }}>No users match the current filters.</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {users.map(user => (
                        <div key={user._id} className="glass glass-hover" onClick={() => setSelectedUserId(user._id)} style={{ padding: "1rem 1.375rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", cursor: "pointer" }}>
                            {/* Avatar */}
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 700, fontSize: "0.8rem", color: "#60a5fa" }}>
                                {getInitials(user.name)}
                            </div>

                            {/* Name + email + phone */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.15rem" }}>
                                    <span style={{ fontWeight: 700, fontSize: "0.9rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
                                    {user.bloodGroup && (
                                        <span style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--primary)", background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: 999, padding: "0.1rem 0.4rem" }}>{user.bloodGroup}</span>
                                    )}
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-faint)", fontSize: "0.79rem" }}>
                                        <Mail style={{ width: 11, height: 11, flexShrink: 0 }} />
                                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                                    </div>
                                    {user.phone && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-faint)", fontSize: "0.79rem" }}>
                                            <Phone style={{ width: 11, height: 11, flexShrink: 0 }} />
                                            <span style={{ whiteSpace: "nowrap" }}>{user.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Badges */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0, flexWrap: "wrap" }}>
                                <Badge label={user.role} colors={ROLE_COLORS[user.role] ?? ROLE_COLORS.donor} />
                                <Badge label={`NID: ${user.nidStatus}`} colors={NID_COLORS[user.nidStatus] ?? NID_COLORS.none} />
                                {user.verified
                                    ? <span title="Verified"><ShieldCheck style={{ width: 15, height: 15, color: "#4ade80" }} /></span>
                                    : <span title="Not verified"><AlertCircle style={{ width: 15, height: 15, color: "#94a3b8" }} /></span>}
                                <span style={{ fontSize: "0.72rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                                    {new Date(user.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
