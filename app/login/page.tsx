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
      setError("Invalid email or password. Please try again.");
      setLoading(false);
      return;
    }

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
        padding: "5rem 1rem 3rem",
        background:
          "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(230,57,70,0.13), transparent)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <Heart className="w-7 h-7 text-red-500 fill-red-500 animate-pulse-blood" aria-hidden="true" />
            <span className="gradient-text">Cantt-Blood</span>
          </Link>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.875rem" }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong" style={{ padding: "2.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "2rem", color: "var(--text)" }}>
            Welcome back
          </h1>

          {error && (
            <div
              className="badge badge-red"
              role="alert"
              style={{
                borderRadius: "var(--radius-sm)",
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
                display: "block",
                fontSize: "0.875rem",
                textTransform: "none",
                letterSpacing: 0,
              }}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="email-input"
              style={{ display: "block", fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.375rem" }}
            >
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                className="w-4 h-4"
                aria-hidden="true"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}
              />
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

          {/* Password */}
          <div style={{ marginBottom: "2rem" }}>
            <label
              htmlFor="password-input"
              style={{ display: "block", fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "0.375rem" }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                className="w-4 h-4"
                aria-hidden="true"
                style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)" }}
              />
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

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Heart className="w-4 h-4" aria-hidden="true" />
            )}
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3" style={{ margin: "1.5rem 0" }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}>Or continue with</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(255,255,255,0.08)" }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard/donor" })}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.625rem",
              width: "100%",
              padding: "0.65rem 1rem",
              borderRadius: "var(--radius-sm)",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--text)",
              fontSize: "0.9rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.18s ease, border-color 0.18s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
            Don&apos;t have an account?{" "}
            <Link href="/register" style={{ color: "var(--primary-light)", fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
