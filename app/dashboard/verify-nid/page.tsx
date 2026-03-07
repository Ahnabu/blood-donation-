"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import {
    ShieldAlert, ShieldCheck, Upload, Loader2, Clock,
    CheckCircle2,
} from "lucide-react";

const UPLOAD_STEPS = [
    { id: "prepare", label: "Preparing image",    Icon: Upload },
    { id: "upload",  label: "Uploading document", Icon: Upload },
    { id: "saving",  label: "Almost done…",       Icon: CheckCircle2 },
    { id: "done",    label: "Submitted!",          Icon: CheckCircle2 },
];

export default function VerifyNidPage() {
    const { data: session, update } = useSession();

    // @ts-expect-error custom fields
    const sessionNidStatus = session?.user?.nidStatus as string | undefined;
    // Flip to "pending" immediately on success without waiting for cookie rotation
    const [localPending, setLocalPending] = useState(false);
    const nidStatus = localPending ? "pending" : sessionNidStatus;

    const [file, setFile] = useState<File | null>(null);
    const [activeStep, setActiveStep] = useState<string | null>(null);
    const [error, setError] = useState("");
    const loading = activeStep !== null;
    const stepIndex = UPLOAD_STEPS.findIndex(s => s.id === activeStep);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setError("");

        try {
            setActiveStep("prepare");
            const formData = new FormData();
            formData.append("nidImage", file);

            setActiveStep("upload");
            const res = await fetch("/api/nid/upload", { method: "POST", body: formData });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || "Upload failed");

            setActiveStep("saving");
            await update({ nidStatus: "pending" });

            setActiveStep("done");
            await new Promise(r => setTimeout(r, 700));
            setLocalPending(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
        } finally {
            setActiveStep(null);
        }
    };

    if (nidStatus === "approved") {
        return (
            <div style={{ maxWidth: 480, margin: "3rem auto 0", textAlign: "center" }}>
                <div className="glass" style={{ padding: "3rem 2.5rem" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <ShieldCheck style={{ width: 36, height: 36, color: "#4ade80" }} />
                    </div>
                    <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem" }}>Identity Verified</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.7 }}>Your national ID has been approved. You have full access to the platform.</p>
                </div>
            </div>
        );
    }

    if (nidStatus === "pending") {
        return (
            <div style={{ maxWidth: 480, margin: "3rem auto 0", textAlign: "center" }}>
                <div className="glass" style={{ padding: "3rem 2.5rem" }}>
                    <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.25)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                        <Clock style={{ width: 36, height: 36, color: "#fbbf24" }} />
                    </div>
                    <h2 style={{ fontSize: "1.375rem", fontWeight: 700, marginBottom: "0.75rem" }}>Under Review</h2>
                    <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem", lineHeight: 1.7 }}>
                        Your NID has been submitted and is being reviewed by our team. This usually takes less than 24 hours.
                    </p>
                    {/* Progress checklist */}
                    <div style={{ marginTop: "1.75rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                        {[
                            { label: "Document uploaded",    done: true },
                            { label: "Admin review",         done: false },
                            { label: "Identity confirmed",   done: false },
                        ].map(({ label, done }) => (
                            <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "0.875rem" }}>
                                <div style={{
                                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.04)",
                                    border: `1px solid ${done ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}`,
                                }}>
                                    {done
                                        ? <CheckCircle2 style={{ width: 12, height: 12, color: "#4ade80" }} />
                                        : <Clock style={{ width: 12, height: 12, color: "var(--text-faint)" }} />
                                    }
                                </div>
                                <span style={{ color: done ? "#4ade80" : "var(--text-muted)" }}>{label}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ marginTop: "1.5rem", padding: "0.875rem 1.25rem", background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.18)", borderRadius: "var(--radius-sm)", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                        You&apos;ll be notified once an admin has reviewed your submission.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 620, margin: "0 auto", padding: "0 0 3rem" }}>

            {/* Page header */}
            <div style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(230,57,70,0.14)", border: "1px solid rgba(230,57,70,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <ShieldAlert style={{ width: 22, height: 22, color: "var(--primary)" }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)", fontWeight: 700, lineHeight: 1.2 }}>Identity Verification</h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.2rem" }}>Required to unlock full platform access</p>
                    </div>
                </div>
            </div>

            {/* Steps indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "2rem", overflowX: "auto", paddingBottom: "0.25rem" }}>
                {[
                    { n: 1, label: "Upload NID" },
                    { n: 2, label: "Admin Review" },
                    { n: 3, label: "Verified" },
                ].map(({ n, label }, i) => (
                    <div key={n} style={{ display: "contents" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                            <div style={{
                                width: 26, height: 26, borderRadius: "50%",
                                background: n === 1 ? "var(--primary)" : "rgba(255,255,255,0.07)",
                                border: n === 1 ? "none" : "1px solid rgba(255,255,255,0.12)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "0.73rem", fontWeight: 700,
                                color: n === 1 ? "#fff" : "var(--text-faint)",
                                flexShrink: 0,
                            }}>{n}</div>
                            <span style={{
                                fontSize: "0.8rem",
                                color: n === 1 ? "var(--text)" : "var(--text-faint)",
                                fontWeight: n === 1 ? 600 : 400,
                                whiteSpace: "nowrap",
                            }}>{label}</span>
                        </div>
                        {i < 2 && <div style={{ flex: 1, minWidth: 16, height: 1, background: "rgba(255,255,255,0.08)" }} />}
                    </div>
                ))}
            </div>

            {/* Main card */}
            <div className="glass" style={{ padding: "clamp(1.5rem, 4vw, 2.5rem)" }}>

                {error && (
                    <div style={{ background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.3)", borderRadius: "var(--radius-sm)", padding: "0.875rem 1rem", fontSize: "0.875rem", color: "#ff9aa2", marginBottom: "1.5rem" }}>{error}</div>
                )}

                <form onSubmit={handleUpload}>
                    <div style={{ marginBottom: "1.75rem" }}>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.75rem" }}>
                            Upload Front Side of NID
                        </label>
                        <label
                            htmlFor="nid-file"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "0.5rem",
                                padding: "2.5rem 1.5rem",
                                border: `2px dashed ${file ? "rgba(74,222,128,0.45)" : "rgba(255,255,255,0.15)"}`,
                                borderRadius: "var(--radius)",
                                background: file ? "rgba(74,222,128,0.05)" : "rgba(255,255,255,0.02)",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "all 0.2s ease",
                                textAlign: "center",
                                opacity: loading ? 0.5 : 1,
                            }}
                        >
                            <input
                                id="nid-file"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                disabled={loading}
                                style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <div style={{ width: 48, height: 48, borderRadius: 12, background: file ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                {file
                                    ? <ShieldCheck style={{ width: 24, height: 24, color: "#4ade80" }} />
                                    : <Upload style={{ width: 24, height: 24, color: "var(--text-muted)" }} />
                                }
                            </div>
                            {file ? (
                                <>
                                    <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "#4ade80" }}>{file.name}</p>
                                    <p style={{ fontSize: "0.8125rem", color: "var(--text-faint)" }}>Click to change file</p>
                                </>
                            ) : (
                                <>
                                    <p style={{ fontWeight: 600, fontSize: "0.9375rem", color: "var(--text)" }}>Click to upload or drag and drop</p>
                                    <p style={{ fontSize: "0.8125rem", color: "var(--text-faint)" }}>PNG, JPG or WebP — max 5 MB</p>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Upload progress steps — visible only while uploading */}
                    {loading && (
                        <div style={{
                            marginBottom: "1.5rem", padding: "1rem 1.25rem",
                            borderRadius: "var(--radius-sm)",
                            background: "rgba(59,130,246,0.06)",
                            border: "1px solid rgba(59,130,246,0.18)",
                            display: "flex", flexDirection: "column", gap: "0.7rem",
                        }}>
                            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.125rem" }}>
                                Upload Progress
                            </p>
                            {UPLOAD_STEPS.map(({ id, label, Icon }, i) => {
                                const done   = i < stepIndex;
                                const active = id === activeStep;
                                return (
                                    <div key={id} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            background: done ? "rgba(74,222,128,0.15)" : active ? "rgba(59,130,246,0.15)" : "rgba(255,255,255,0.04)",
                                            border: `1px solid ${done ? "rgba(74,222,128,0.3)" : active ? "rgba(59,130,246,0.3)" : "rgba(255,255,255,0.08)"}`,
                                        }}>
                                            {done
                                                ? <CheckCircle2 style={{ width: 14, height: 14, color: "#4ade80" }} />
                                                : active
                                                    ? <Loader2 style={{ width: 14, height: 14, color: "#60a5fa", animation: "spin 1s linear infinite" }} />
                                                    : <Icon style={{ width: 14, height: 14, color: "var(--text-faint)" }} />
                                            }
                                        </div>
                                        <span style={{
                                            fontSize: "0.8375rem",
                                            color: done ? "#4ade80" : active ? "#93c5fd" : "var(--text-faint)",
                                            fontWeight: active ? 600 : 400,
                                        }}>
                                            {label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-primary"
                        style={{ width: "100%", justifyContent: "center", padding: "0.9375rem", fontSize: "1rem" }}
                        disabled={!file || loading}
                    >
                        {loading
                            ? <Loader2 style={{ width: 18, height: 18, animation: "spin 1s linear infinite" }} />
                            : <ShieldCheck style={{ width: 18, height: 18 }} />
                        }
                        {loading ? "Uploading…" : "Submit for Verification"}
                    </button>
                </form>

                <div style={{ marginTop: "1.75rem", display: "flex", gap: "0.75rem", padding: "1rem 1.125rem", background: "rgba(230,57,70,0.07)", border: "1px solid rgba(230,57,70,0.18)", borderRadius: "var(--radius-sm)" }}>
                    <ShieldAlert style={{ width: 18, height: 18, color: "var(--primary)", flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
                        <strong style={{ color: "var(--text)" }}>Privacy Note:</strong> Your NID image is stored securely and encrypted. It is only used for identity verification by approved admins and will never be shared publicly.
                    </p>
                </div>
            </div>
        </div>
    );
}
