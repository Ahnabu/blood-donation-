"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck, Upload, Loader2, Clock } from "lucide-react";

export default function VerifyNidPage() {
    const { data: session, update } = useSession();
    const router = useRouter();

    // @ts-expect-error custom fields
    const nidStatus = session?.user?.nidStatus as string | undefined;

    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("nidImage", file);

        try {
            const res = await fetch("/api/nid/upload", { method: "POST", body: formData });
            const json = await res.json();

            if (!json.success) {
                throw new Error(json.error || "Upload failed");
            }

            // Update next-auth session locally to reflect pending status
            await update({ nidStatus: "pending" });
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (nidStatus === "approved") {
        return (
            <div className="glass p-8 text-center max-w-md mx-auto mt-10">
                <ShieldCheck className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--success)" }} />
                <h2 className="text-xl font-bold mb-2">Identity Verified</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Your national ID has been approved. You have full access to the platform.</p>
            </div>
        );
    }

    if (nidStatus === "pending") {
        return (
            <div className="glass p-8 text-center max-w-md mx-auto mt-10">
                <Clock className="w-16 h-16 mx-auto mb-4" style={{ color: "var(--warning)" }} />
                <h2 className="text-xl font-bold mb-2">Review Pending</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                    Your NID is currently being reviewed by our administrative team. This usually takes less than 24 hours.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-6">
            <div className="glass p-8">
                <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-6">
                    <ShieldAlert className="w-8 h-8" style={{ color: "var(--primary)" }} />
                    <div>
                        <h1 className="text-xl font-bold">Identity Verification Required</h1>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                            To ensure platform safety, all users must verify their National Identity Card (NID).
                        </p>
                    </div>
                </div>

                {error && (
                    <div className="badge badge-red mb-6 block p-3 text-sm rounded-lg">{error}</div>
                )}

                <form onSubmit={handleUpload}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2" style={{ color: "var(--text)" }}>
                            Upload Front Side of NID
                        </label>
                        <div className="border-2 border-dashed border-white/20 hover:border-red-500/50 transition-colors rounded-xl p-8 text-center cursor-pointer bg-white/5 relative">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <Upload className="w-8 h-8 mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
                            {file ? (
                                <p className="text-sm font-medium" style={{ color: "var(--success)" }}>{file.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Click to upload or drag and drop</p>
                                    <p className="text-xs mt-1" style={{ color: "var(--text-faint)" }}>SVG, PNG, JPG or GIF (max. 5MB)</p>
                                </>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="btn-primary w-full justify-center" disabled={!file || loading}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        {loading ? "Uploading..." : "Submit for Verification"}
                    </button>
                </form>

                <div className="mt-6" style={{ background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: "var(--radius-sm)", padding: "1rem", fontSize: "0.875rem", color: "var(--text)" }}>
                    <strong>Privacy Note:</strong> Your NID image is stored securely and encrypted. It is only used for identity verification by approved admins and will never be shared publicly.
                </div>
            </div>
        </div>
    );
}
