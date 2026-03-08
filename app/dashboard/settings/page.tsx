"use client";
import { useState, useEffect, useCallback } from "react";
import { User, Lock, ShieldCheck, AlertCircle, CheckCircle2, Loader2, Droplets, CalendarDays, Heart, Scale, MapPin } from "lucide-react";
import { useSession } from "next-auth/react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function MedCheck({ label, checked, onChange, detail }: { label: string; checked: boolean; onChange: (v: boolean) => void; detail?: React.ReactNode }) {
    return (
        <div>
            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
                    style={{ width: 15, height: 15, marginTop: 2, accentColor: "var(--primary)", cursor: "pointer", flexShrink: 0 }} />
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>{label}</span>
            </label>
            {detail}
        </div>
    );
}

interface UserData {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    bloodGroup?: string;
    dateOfBirth?: string;
    role: string;
    nidStatus?: string;
    createdAt?: string;
}

export default function SettingsPage() {
    const { data: session } = useSession();
    const [user, setUser] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    // Profile form
    const [name, setName]           = useState("");
    const [phone, setPhone]         = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Password form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    // Donor profile form
    const [donorAge, setDonorAge]               = useState("");
    const [donorWeight, setDonorWeight]         = useState("");
    const [donorArea, setDonorArea]             = useState("");
    const [donorLastDonated, setDonorLastDonated] = useState("");
    const [donorAvailable, setDonorAvailable]   = useState(true);
    const [medHistory, setMedHistory] = useState({
        hasChronicCondition: false,
        chronicConditionDetails: "",
        recentTattoo: false,
        tattooDate: "",
        recentAntibiotics: false,
        antibioticEndDate: "",
        malariaExposure: false,
        malariaDate: "",
        isPregnant: false,
        recentTransfusion: false,
        transfusionDate: "",
    });
    const [donorProfileLoading, setDonorProfileLoading] = useState(true);
    const [donorSaving, setDonorSaving] = useState(false);
    const [donorMsg, setDonorMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch("/api/user/settings");
            const json = await res.json();
            if (json.success) {
                setUser(json.data);
                setName(json.data.name ?? "");
                setPhone(json.data.phone ?? "");
                setBloodGroup(json.data.bloodGroup ?? "");
                setDateOfBirth(json.data.dateOfBirth ? json.data.dateOfBirth.split("T")[0] : "");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDonorProfile = useCallback(async () => {
        try {
            const res = await fetch("/api/donors/me");
            const json = await res.json();
            if (json.success && json.data) {
                const d = json.data;
                setDonorAge(d.age != null ? String(d.age) : "");
                setDonorWeight(d.weight != null ? String(d.weight) : "");
                setDonorArea(d.area ?? "");
                setDonorLastDonated(d.lastDonated ? d.lastDonated.split("T")[0] : "");
                setDonorAvailable(d.isAvailable ?? true);
                if (d.medicalHistory) {
                    setMedHistory({
                        hasChronicCondition: d.medicalHistory.hasChronicCondition ?? false,
                        chronicConditionDetails: d.medicalHistory.chronicConditionDetails ?? "",
                        recentTattoo: d.medicalHistory.recentTattoo ?? false,
                        tattooDate: d.medicalHistory.tattooDate ? d.medicalHistory.tattooDate.split("T")[0] : "",
                        recentAntibiotics: d.medicalHistory.recentAntibiotics ?? false,
                        antibioticEndDate: d.medicalHistory.antibioticEndDate ? d.medicalHistory.antibioticEndDate.split("T")[0] : "",
                        malariaExposure: d.medicalHistory.malariaExposure ?? false,
                        malariaDate: d.medicalHistory.malariaDate ? d.medicalHistory.malariaDate.split("T")[0] : "",
                        isPregnant: d.medicalHistory.isPregnant ?? false,
                        recentTransfusion: d.medicalHistory.recentTransfusion ?? false,
                        transfusionDate: d.medicalHistory.transfusionDate ? d.medicalHistory.transfusionDate.split("T")[0] : "",
                    });
                }
            }
        } finally {
            setDonorProfileLoading(false);
        }
    }, []);

    useEffect(() => { fetchUser(); }, [fetchUser]);

    useEffect(() => {
        if (role === "donor") fetchDonorProfile();
        else setDonorProfileLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role]);

    async function handleProfileSave(e: React.FormEvent) {
        e.preventDefault();
        setProfileSaving(true);
        setProfileMsg(null);
        try {
            const res = await fetch("/api/user/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, bloodGroup, dateOfBirth }),
            });
            const json = await res.json();
            if (json.success) {
                setProfileMsg({ type: "success", text: "Profile updated successfully." });
                fetchUser();
            } else {
                setProfileMsg({ type: "error", text: json.error ?? "Failed to update profile." });
            }
        } catch {
            setProfileMsg({ type: "error", text: "Network error. Please try again." });
        } finally {
            setProfileSaving(false);
        }
    }

    async function handlePasswordSave(e: React.FormEvent) {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setPwMsg({ type: "error", text: "Passwords do not match." });
            return;
        }
        if (newPassword.length < 8) {
            setPwMsg({ type: "error", text: "Password must be at least 8 characters." });
            return;
        }
        setPwSaving(true);
        setPwMsg(null);
        try {
            const res = await fetch("/api/user/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const json = await res.json();
            if (json.success) {
                setPwMsg({ type: "success", text: "Password changed successfully." });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                setPwMsg({ type: "error", text: json.error ?? "Failed to change password." });
            }
        } catch {
            setPwMsg({ type: "error", text: "Network error. Please try again." });
        } finally {
            setPwSaving(false);
        }
    }

    async function handleDonorProfileSave(e: React.FormEvent) {
        e.preventDefault();
        setDonorSaving(true);
        setDonorMsg(null);
        try {
            const res = await fetch("/api/donors/me", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    age: donorAge ? Number(donorAge) : undefined,
                    weight: donorWeight ? Number(donorWeight) : undefined,
                    area: donorArea || undefined,
                    lastDonated: donorLastDonated || null,
                    isAvailable: donorAvailable,
                    medicalHistory: medHistory,
                }),
            });
            const json = await res.json();
            if (json.success) {
                setDonorMsg({ type: "success", text: "Donor profile updated successfully." });
            } else {
                setDonorMsg({ type: "error", text: json.error ?? "Failed to update donor profile." });
            }
        } catch {
            setDonorMsg({ type: "error", text: "Network error. Please try again." });
        } finally {
            setDonorSaving(false);
        }
    }

    const role = (session?.user as { role?: string })?.role ?? user?.role;

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
                <div style={{ fontSize: "1.625rem", fontWeight: 700, marginBottom: "0.375rem", color: "var(--text)" }}>Account Settings</div>
                <p style={{ color: "var(--text-muted)" }}>Manage your profile, security, and account details.</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: 680 }}>

                {/* ── Profile Info ── */}
                <div className="glass" style={{ padding: "1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
                        <div style={{ padding: 8, borderRadius: 8, background: "rgba(59,130,246,0.12)" }}>
                            <User style={{ width: 18, height: 18, color: "var(--info)" }} />
                        </div>
                        <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>Profile Information</div>
                    </div>

                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ height: 42, borderRadius: 8, background: "rgba(255,255,255,0.05)", animation: "pulse 1.6s ease-in-out infinite" }} />
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handleProfileSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Full Name</label>
                                <input
                                    className="input"
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Your full name"
                                    required
                                    style={{ width: "100%", boxSizing: "border-box" }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Email Address</label>
                                <input
                                    className="input"
                                    type="email"
                                    value={user?.email ?? ""}
                                    readOnly
                                    style={{ width: "100%", boxSizing: "border-box", opacity: 0.6, cursor: "not-allowed" }}
                                />
                                <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginTop: 4 }}>Email cannot be changed.</p>
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Phone Number</label>
                                <input
                                    className="input"
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    placeholder="+880…"
                                    style={{ width: "100%", boxSizing: "border-box" }}
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                                    <Droplets style={{ display: "inline", width: 13, height: 13, marginRight: 5, color: "var(--primary)", verticalAlign: "middle" }} />
                                    Blood Group
                                </label>
                                <div style={{ position: "relative" }}>
                                    <select
                                        className="input"
                                        value={bloodGroup}
                                        onChange={e => setBloodGroup(e.target.value)}
                                        style={{ width: "100%", boxSizing: "border-box", cursor: "pointer" }}
                                    >
                                        <option value="">Select blood group</option>
                                        {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                                    <CalendarDays style={{ display: "inline", width: 13, height: 13, marginRight: 5, color: "#a78bfa", verticalAlign: "middle" }} />
                                    Date of Birth
                                </label>
                                <input
                                    className="input"
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={e => setDateOfBirth(e.target.value)}
                                    max={new Date().toISOString().split("T")[0]}
                                    style={{ width: "100%", boxSizing: "border-box" }}
                                />
                                <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginTop: 4 }}>Used to determine the correct identity document (NID or Birth Certificate).</p>
                            </div>

                            {profileMsg && (
                                <div style={{
                                    display: "flex", alignItems: "center", gap: 8,
                                    padding: "0.6rem 0.875rem", borderRadius: 8, fontSize: "0.85rem",
                                    background: profileMsg.type === "success" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                                    border: `1px solid ${profileMsg.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                                    color: profileMsg.type === "success" ? "#4ade80" : "#f87171",
                                }}>
                                    {profileMsg.type === "success" ? <CheckCircle2 style={{ width: 15, height: 15, flexShrink: 0 }} /> : <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />}
                                    {profileMsg.text}
                                </div>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={profileSaving}
                                    style={{ fontSize: "0.875rem", padding: "0.55rem 1.5rem", display: "flex", alignItems: "center", gap: 6 }}
                                >
                                    {profileSaving && <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />}
                                    Save Profile
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* ── Change Password ── */}
                <div className="glass" style={{ padding: "1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
                        <div style={{ padding: 8, borderRadius: 8, background: "rgba(230,57,70,0.12)" }}>
                            <Lock style={{ width: 18, height: 18, color: "var(--primary)" }} />
                        </div>
                        <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>Change Password</div>
                    </div>

                    <form onSubmit={handlePasswordSave} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Current Password</label>
                            <input
                                className="input"
                                type="password"
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                placeholder="Your current password"
                                required
                                style={{ width: "100%", boxSizing: "border-box" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>New Password</label>
                            <input
                                className="input"
                                type="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="Min. 8 characters"
                                required
                                style={{ width: "100%", boxSizing: "border-box" }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>Confirm New Password</label>
                            <input
                                className="input"
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                                required
                                style={{ width: "100%", boxSizing: "border-box" }}
                            />
                        </div>

                        {pwMsg && (
                            <div style={{
                                display: "flex", alignItems: "center", gap: 8,
                                padding: "0.6rem 0.875rem", borderRadius: 8, fontSize: "0.85rem",
                                background: pwMsg.type === "success" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                                border: `1px solid ${pwMsg.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                                color: pwMsg.type === "success" ? "#4ade80" : "#f87171",
                            }}>
                                {pwMsg.type === "success" ? <CheckCircle2 style={{ width: 15, height: 15, flexShrink: 0 }} /> : <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />}
                                {pwMsg.text}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={pwSaving}
                                style={{ fontSize: "0.875rem", padding: "0.55rem 1.5rem", display: "flex", alignItems: "center", gap: 6 }}
                            >
                                {pwSaving && <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />}
                                Change Password
                            </button>
                        </div>
                    </form>
                </div>

                {/* ── Donor Profile & Medical History ── */}
                {role === "donor" && (
                    <div className="glass" style={{ padding: "1.75rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
                            <div style={{ padding: 8, borderRadius: 8, background: "rgba(230,57,70,0.12)" }}>
                                <Heart style={{ width: 18, height: 18, color: "var(--primary)" }} />
                            </div>
                            <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>Donor Profile &amp; Medical History</div>
                        </div>

                        {donorProfileLoading ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {[1,2,3].map(i => (
                                    <div key={i} style={{ height: 42, borderRadius: 8, background: "rgba(255,255,255,0.05)" }} />
                                ))}
                            </div>
                        ) : (
                            <form onSubmit={handleDonorProfileSave} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                                {/* Basic info */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                                            <Scale style={{ display: "inline", width: 13, height: 13, marginRight: 5, verticalAlign: "middle" }} />
                                            Age (years)
                                        </label>
                                        <input className="input" type="number" min="18" max="65" value={donorAge}
                                            onChange={e => setDonorAge(e.target.value)}
                                            placeholder="e.g. 25" style={{ width: "100%", boxSizing: "border-box" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                                            <Scale style={{ display: "inline", width: 13, height: 13, marginRight: 5, verticalAlign: "middle" }} />
                                            Weight (kg)
                                        </label>
                                        <input className="input" type="number" min="45" value={donorWeight}
                                            onChange={e => setDonorWeight(e.target.value)}
                                            placeholder="e.g. 60" style={{ width: "100%", boxSizing: "border-box" }} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                                        <MapPin style={{ display: "inline", width: 13, height: 13, marginRight: 5, verticalAlign: "middle" }} />
                                        Area / Location
                                    </label>
                                    <input className="input" type="text" value={donorArea}
                                        onChange={e => setDonorArea(e.target.value)}
                                        placeholder="e.g. Mirpur, Dhaka" style={{ width: "100%", boxSizing: "border-box" }} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 6 }}>
                                        <CalendarDays style={{ display: "inline", width: 13, height: 13, marginRight: 5, verticalAlign: "middle" }} />
                                        Last Donated
                                    </label>
                                    <input className="input" type="date" value={donorLastDonated}
                                        onChange={e => setDonorLastDonated(e.target.value)}
                                        max={new Date().toISOString().split("T")[0]}
                                        style={{ width: "100%", boxSizing: "border-box" }} />
                                    <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", marginTop: 4 }}>Used to calculate your next eligible donation date (90 days after last donation).</p>
                                </div>

                                {/* Availability toggle */}
                                <label style={{ display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                                    <input type="checkbox" checked={donorAvailable} onChange={e => setDonorAvailable(e.target.checked)}
                                        style={{ width: 16, height: 16, accentColor: "var(--primary)", cursor: "pointer" }} />
                                    <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>I am currently available to donate</span>
                                </label>

                                {/* Medical history */}
                                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.25rem" }}>
                                    <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", marginBottom: "1rem" }}>Medical History</p>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>

                                        <MedCheck label="Do you have any chronic conditions?" checked={medHistory.hasChronicCondition}
                                            onChange={v => setMedHistory(p => ({ ...p, hasChronicCondition: v }))}
                                            detail={medHistory.hasChronicCondition ? (
                                                <input className="input" type="text" value={medHistory.chronicConditionDetails}
                                                    onChange={e => setMedHistory(p => ({ ...p, chronicConditionDetails: e.target.value }))}
                                                    placeholder="Describe the condition" style={{ width: "100%", boxSizing: "border-box", marginTop: 8 }} />
                                            ) : null} />

                                        <MedCheck label="Have you had a tattoo or piercing in the last 6 months?" checked={medHistory.recentTattoo}
                                            onChange={v => setMedHistory(p => ({ ...p, recentTattoo: v }))}
                                            detail={medHistory.recentTattoo ? (
                                                <input className="input" type="date" value={medHistory.tattooDate}
                                                    onChange={e => setMedHistory(p => ({ ...p, tattooDate: e.target.value }))}
                                                    max={new Date().toISOString().split("T")[0]}
                                                    style={{ width: "100%", boxSizing: "border-box", marginTop: 8 }} />
                                            ) : null} />

                                        <MedCheck label="Have you taken antibiotics in the last 2 weeks?" checked={medHistory.recentAntibiotics}
                                            onChange={v => setMedHistory(p => ({ ...p, recentAntibiotics: v }))}
                                            detail={medHistory.recentAntibiotics ? (
                                                <input className="input" type="date" value={medHistory.antibioticEndDate}
                                                    onChange={e => setMedHistory(p => ({ ...p, antibioticEndDate: e.target.value }))}
                                                    placeholder="End date of antibiotic course"
                                                    max={new Date().toISOString().split("T")[0]}
                                                    style={{ width: "100%", boxSizing: "border-box", marginTop: 8 }} />
                                            ) : null} />

                                        <MedCheck label="Have you been exposed to malaria in the last 3 years?" checked={medHistory.malariaExposure}
                                            onChange={v => setMedHistory(p => ({ ...p, malariaExposure: v }))}
                                            detail={medHistory.malariaExposure ? (
                                                <input className="input" type="date" value={medHistory.malariaDate}
                                                    onChange={e => setMedHistory(p => ({ ...p, malariaDate: e.target.value }))}
                                                    max={new Date().toISOString().split("T")[0]}
                                                    style={{ width: "100%", boxSizing: "border-box", marginTop: 8 }} />
                                            ) : null} />

                                        <MedCheck label="Are you currently pregnant or breastfeeding?" checked={medHistory.isPregnant}
                                            onChange={v => setMedHistory(p => ({ ...p, isPregnant: v }))} />

                                        <MedCheck label="Have you received a blood transfusion in the last year?" checked={medHistory.recentTransfusion}
                                            onChange={v => setMedHistory(p => ({ ...p, recentTransfusion: v }))}
                                            detail={medHistory.recentTransfusion ? (
                                                <input className="input" type="date" value={medHistory.transfusionDate}
                                                    onChange={e => setMedHistory(p => ({ ...p, transfusionDate: e.target.value }))}
                                                    max={new Date().toISOString().split("T")[0]}
                                                    style={{ width: "100%", boxSizing: "border-box", marginTop: 8 }} />
                                            ) : null} />

                                    </div>
                                </div>

                                {donorMsg && (
                                    <div style={{
                                        display: "flex", alignItems: "center", gap: 8,
                                        padding: "0.6rem 0.875rem", borderRadius: 8, fontSize: "0.85rem",
                                        background: donorMsg.type === "success" ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                                        border: `1px solid ${donorMsg.type === "success" ? "rgba(74,222,128,0.3)" : "rgba(248,113,113,0.3)"}`,
                                        color: donorMsg.type === "success" ? "#4ade80" : "#f87171",
                                    }}>
                                        {donorMsg.type === "success" ? <CheckCircle2 style={{ width: 15, height: 15, flexShrink: 0 }} /> : <AlertCircle style={{ width: 15, height: 15, flexShrink: 0 }} />}
                                        {donorMsg.text}
                                    </div>
                                )}

                                <div>
                                    <button type="submit" className="btn-primary" disabled={donorSaving}
                                        style={{ fontSize: "0.875rem", padding: "0.55rem 1.5rem", display: "flex", alignItems: "center", gap: 6 }}>
                                        {donorSaving && <Loader2 style={{ width: 14, height: 14, animation: "spin 1s linear infinite" }} />}
                                        Save Donor Profile
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}

                {/* ── Account Details (read-only) ── */}
                <div className="glass" style={{ padding: "1.75rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.5rem" }}>
                        <div style={{ padding: 8, borderRadius: 8, background: "rgba(168,85,247,0.12)" }}>
                            <ShieldCheck style={{ width: 18, height: 18, color: "#c084fc" }} />
                        </div>
                        <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text)" }}>Account Details</div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
                        {[
                            {
                                label: "Role",
                                value: role ? (
                                    <span className={`badge ${role === "admin" ? "badge-red" : role === "donor" ? "badge-green" : "badge-blue"}`} style={{ textTransform: "capitalize" }}>
                                        {role}
                                    </span>
                                ) : "—",
                            },
                            {
                                label: "Identity Verification",
                                value: user?.nidStatus ? (
                                    <span style={{
                                        fontSize: "0.75rem", fontWeight: 700,
                                        padding: "2px 10px", borderRadius: 999,
                                        background: user.nidStatus === "approved" ? "rgba(74,222,128,0.15)" : "rgba(251,191,36,0.15)",
                                        color: user.nidStatus === "approved" ? "#4ade80" : "#fbbf24",
                                        border: `1px solid ${user.nidStatus === "approved" ? "rgba(74,222,128,0.3)" : "rgba(251,191,36,0.3)"}`,
                                        textTransform: "capitalize",
                                    }}>
                                        {user.nidStatus}
                                    </span>
                                ) : "—",
                            },
                            {
                                label: "Member Since",
                                value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) : "—",
                            },
                        ].map(({ label, value }) => (
                            <div key={label} style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                padding: "0.6rem 0",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                            }}>
                                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{label}</span>
                                <div style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 600 }}>{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
