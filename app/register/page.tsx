"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Heart, Mail, Lock, User, Phone, Loader2, Droplets, Calendar, CalendarDays, FileText } from "lucide-react";

const LABEL_STYLE = {
  display: "block",
  fontSize: "0.875rem",
  color: "var(--text-muted)",
  marginBottom: "0.375rem",
  fontWeight: 500,
} as const;

const ICON_STYLE = {
  position: "absolute" as const,
  left: 12,
  top: "50%",
  transform: "translateY(-50%)",
  color: "var(--text-faint)",
  pointerEvents: "none" as const,
};

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const defaultRole = params.get("role") === "receiver" ? "receiver" : "donor";

  const [form, setForm] = useState({ name: "", email: "", password: "", role: defaultRole, phone: "", bloodGroup: "", dateOfBirth: "", lastDonated: "", cause: "" });
  const todayStr = new Date().toISOString().split("T")[0];
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
      setError(json.error || "Registration failed. Please try again.");
      setLoading(false);
      return;
    }

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
        padding: "5rem 1rem 3rem",
        background:
          "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(230,57,70,0.13), transparent)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl">
            <Heart className="w-7 h-7 text-red-500 fill-red-500 animate-pulse-blood" aria-hidden="true" />
            <span className="gradient-text">Droplet</span>
          </Link>
          <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", fontSize: "0.875rem" }}>
            Create your free account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-strong" style={{ padding: "clamp(1.25rem, 5vw, 2.5rem)" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem", color: "var(--text)" }}>
            Join Droplet
          </h1>

          {/* Role selector */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
              marginBottom: "1.75rem",
            }}
          >
            {(["donor", "receiver"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => update("role", r)}
                className={form.role === r ? "btn-primary" : "btn-secondary"}
                style={{ padding: "0.625rem 1rem" }}
              >
                {r === "donor" ? "Donor" : "Receiver"}
              </button>
            ))}
          </div>

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

          <div style={{ display: "flex", flexDirection: "column", gap: "1.125rem", marginBottom: "1.75rem" }}>
            {/* Full name */}
            <div>
              <label htmlFor="reg-name" style={LABEL_STYLE}>Full Name</label>
              <div style={{ position: "relative" }}>
                <User className="w-4 h-4" aria-hidden="true" style={ICON_STYLE} />
                <input
                  id="reg-name"
                  type="text"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" style={LABEL_STYLE}>Email Address</label>
              <div style={{ position: "relative" }}>
                <Mail className="w-4 h-4" aria-hidden="true" style={ICON_STYLE} />
                <input
                  id="reg-email"
                  type="email"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="reg-phone" style={LABEL_STYLE}>
                Phone{" "}
                <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.8rem" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Phone className="w-4 h-4" aria-hidden="true" style={ICON_STYLE} />
                <input
                  id="reg-phone"
                  type="tel"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  required
                  placeholder="+880…"
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label htmlFor="reg-blood" style={LABEL_STYLE}>
                Blood Group{" "}
                <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.8rem" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <Droplets className="w-4 h-4" aria-hidden="true" style={ICON_STYLE} />
                <select
                  id="reg-blood"
                  className="input"
                  style={{ paddingLeft: "2.5rem", cursor: "pointer" }}
                  value={form.bloodGroup}
                  onChange={(e) => update("bloodGroup", e.target.value)}
                  required
                >
                  <option value="" disabled>Select blood group</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="reg-dob" style={LABEL_STYLE}>
                Date of Birth{" "}
                <span style={{ color: "var(--text-faint)", fontWeight: 400, fontSize: "0.8rem" }}>(optional)</span>
              </label>
              <p style={{ fontSize: "0.78rem", color: "var(--text-faint)", marginBottom: "0.375rem", marginTop: "-0.25rem" }}>
                Used to determine the correct identity document for verification (NID or Birth Certificate).
              </p>
              <div style={{ position: "relative" }}>
                <CalendarDays className="w-4 h-4" aria-hidden="true" style={ICON_STYLE} />
                <input
                  id="reg-dob"
                  type="date"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={form.dateOfBirth}
                  onChange={(e) => update("dateOfBirth", e.target.value)}
                  max={todayStr}
                />
              </div>
            </div>

            {/* Last Donation Date — donors only */}
            {form.role === "donor" && (
              <div>
                <label htmlFor="reg-last-donated" style={LABEL_STYLE}>
                  Last Donation Date{" "}
                  <span style={{ color: "var(--text-faint)", fontWeight: 400, fontSize: "0.8rem" }}>(optional — leave blank if never donated)</span>
                </label>
                <div style={{ position: "relative" }}>
                  <Calendar className="w-4 h-4" aria-hidden="true" style={ICON_STYLE} />
                  <input
                    id="reg-last-donated"
                    type="date"
                    className="input"
                    style={{ paddingLeft: "2.5rem" }}
                    value={form.lastDonated}
                    onChange={(e) => update("lastDonated", e.target.value)}
                    max={todayStr}
                  />
                </div>
              </div>
            )}

            {/* Cause — receivers only */}
            {form.role === "receiver" && (
              <div>
                <label htmlFor="reg-cause" style={LABEL_STYLE}>
                  Reason for Needing Blood{" "}
                  <span style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.8rem" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <FileText
                    className="w-4 h-4"
                    aria-hidden="true"
                    style={{ ...ICON_STYLE, top: "1.1rem", transform: "none" }}
                  />
                  <textarea
                    id="reg-cause"
                    className="input"
                    style={{ paddingLeft: "2.5rem", minHeight: "5rem", resize: "vertical" }}
                    value={form.cause}
                    onChange={(e) => update("cause", e.target.value)}
                    required
                    rows={3}
                    placeholder="e.g. Scheduled surgery, accident, chronic condition…"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="reg-password" style={LABEL_STYLE}>Password</label>
              <div style={{ position: "relative" }}>
                <Lock className="w-4 h-4" aria-hidden="true" style={ICON_STYLE} />
                <input
                  id="reg-password"
                  type="password"
                  className="input"
                  style={{ paddingLeft: "2.5rem" }}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
              </div>
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
            {loading ? "Creating account…" : "Create Account"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3" style={{ margin: "1.5rem 0" }}>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: "0.8rem", color: "var(--text-faint)", whiteSpace: "nowrap" }}>Or register with</span>
            <hr style={{ flex: 1, border: "none", borderTop: "1px solid rgba(255,255,255,0.08)" }} />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
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
            Continue with Google
          </button>

          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "1.5rem" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "var(--primary-light)", fontWeight: 600 }}>
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--primary)" }} />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
