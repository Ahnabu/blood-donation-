"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Heart, Mail, Lock, User, Phone, Loader2 } from "lucide-react";

function RegisterForm() {
    const router = useRouter();
    const params = useSearchParams();
    const defaultRole = params.get("role") === "receiver" ? "receiver" : "donor";

    const [form, setForm] = useState({ name: "", email: "", password: "", role: defaultRole, phone: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });
        const json = await res.json();

        if (!json.success) {
            setError(json.error || "Registration failed");
            setLoading(false);
            return;
        }

        // Auto sign-in after registration
        await signIn("credentials", { email: form.email, password: form.password, redirect: false });
        router.push("/dashboard/verify-nid");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "2rem 1rem",
                background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(220,38,38,0.1), transparent)",
            }}
        >
            <div style={{ width: "100%", maxWidth: 480 }}>
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
                        <Heart className="w-7 h-7 text-red-500 fill-red-500 animate-pulse-blood" />
                        <span className="gradient-text">LifeLink</span>
                    </Link>
                    <p className="text-gray-400 mt-2 text-sm">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-strong" style={{ padding: "2.5rem" }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Join LifeLink</h1>

                    {/* Role selector */}
                    <div className="flex gap-3 mb-6">
                        {(["donor", "receiver"] as const).map((r) => (
                            <button
                                key={r}
                                type="button"
                                id={`role-${r}-btn`}
                                onClick={() => update("role", r)}
                                className={form.role === r ? "btn-primary" : "btn-secondary"}
                                style={{ flex: 1, justifyContent: "center", padding: "0.625rem" }}
                            >
                                {r === "donor" ? "🩸 Donor" : "🏥 Receiver"}
                            </button>
                        ))}
                    </div>

                    {error && (
                        <div className="badge badge-red" style={{ borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem", display: "block", fontSize: "0.875rem" }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "1.5rem" }}>
                        {/* Name */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="reg-name">Full Name</label>
                            <div style={{ position: "relative" }}>
                                <User className="w-4 h-4 text-gray-500" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                                <input id="reg-name" type="text" className="input" style={{ paddingLeft: "2.5rem" }} value={form.name} onChange={(e) => update("name", e.target.value)} required placeholder="Your full name" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="reg-email">Email Address</label>
                            <div style={{ position: "relative" }}>
                                <Mail className="w-4 h-4 text-gray-500" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                                <input id="reg-email" type="email" className="input" style={{ paddingLeft: "2.5rem" }} value={form.email} onChange={(e) => update("email", e.target.value)} required placeholder="you@example.com" />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="reg-phone">Phone (optional)</label>
                            <div style={{ position: "relative" }}>
                                <Phone className="w-4 h-4 text-gray-500" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                                <input id="reg-phone" type="tel" className="input" style={{ paddingLeft: "2.5rem" }} value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+880..." />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="reg-password">Password (min 8 chars)</label>
                            <div style={{ position: "relative" }}>
                                <Lock className="w-4 h-4 text-gray-500" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                                <input id="reg-password" type="password" className="input" style={{ paddingLeft: "2.5rem" }} value={form.password} onChange={(e) => update("password", e.target.value)} required minLength={8} placeholder="Min. 8 characters" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" id="register-submit-btn" className="btn-primary" disabled={loading} style={{ justifyContent: "center", width: "100%" }}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                        {loading ? "Creating account..." : "Create Account"}
                    </button>

                    <div className="flex items-center gap-4 my-6">
                        <hr className="flex-1 border-white/10" />
                        <span className="text-sm text-gray-500">Or register with</span>
                        <hr className="flex-1 border-white/10" />
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn("google", { callbackUrl: "/dashboard/donor" })}
                        className="btn-secondary w-full"
                        style={{ justifyContent: "center", width: "100%", padding: "0.625rem" }}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Sign in with Google
                    </button>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{" "}
                        <Link href="/login" className="text-red-400 hover:text-red-300 font-medium">Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-red-500">Loading...</div>}>
            <RegisterForm />
        </Suspense>
    );
}
