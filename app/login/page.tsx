"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid email or password");
            setLoading(false);
            return;
        }

        // Redirect based on role (middleware will guard)
        router.push("/dashboard/donor");
        router.refresh();
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
            <div style={{ width: "100%", maxWidth: 440 }}>
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
                        <Heart className="w-7 h-7 text-red-500 fill-red-500 animate-pulse-blood" />
                        <span className="gradient-text">LifeLink</span>
                    </Link>
                    <p className="text-gray-400 mt-2 text-sm">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-strong" style={{ padding: "2.5rem" }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem" }}>Welcome back</h1>

                    {error && (
                        <div className="badge badge-red" style={{ borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.5rem", display: "block", fontSize: "0.875rem" }}>
                            {error}
                        </div>
                    )}

                    <div style={{ marginBottom: "1.25rem" }}>
                        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="email-input">Email address</label>
                        <div style={{ position: "relative" }}>
                            <Mail className="w-4 h-4 text-gray-500" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                            <input
                                id="email-input"
                                type="email"
                                className="input"
                                style={{ paddingLeft: "2.5rem" }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="you@example.com"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "2rem" }}>
                        <label className="block text-sm text-gray-400 mb-1.5" htmlFor="password-input">Password</label>
                        <div style={{ position: "relative" }}>
                            <Lock className="w-4 h-4 text-gray-500" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                            <input
                                id="password-input"
                                type="password"
                                className="input"
                                style={{ paddingLeft: "2.5rem" }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button type="submit" id="login-submit-btn" className="btn-primary w-full" disabled={loading} style={{ justifyContent: "center", width: "100%" }}>
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Heart className="w-4 h-4" />}
                        {loading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-red-400 hover:text-red-300 font-medium">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
