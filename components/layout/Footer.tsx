import Link from "next/link";
import { Heart } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const PLATFORM_LINKS = [
  ["Find a Donor",      "/find-donor"],
  ["Request Blood",     "/register?role=receiver"],
  ["How It Works",      "/how-it-works"],
  ["Blood Types Chart", "/blood-types"],
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8, 12, 20, 0.95)",
      }}
    >
      <div style={{ padding: "3.5rem clamp(1.5rem, 5vw, 3rem)" }}>

        {/* ── Main grid ───────────────────────────────────────── */}
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontWeight: 700, fontSize: "1.125rem", marginBottom: "0.875rem", textDecoration: "none" }}>
              <Heart style={{ width: 22, height: 22, color: "#e63946", fill: "#e63946" }} aria-hidden="true" />
              <span className="gradient-text">Cantt-Blood</span>
            </Link>
            <p style={{ fontSize: "0.875rem", lineHeight: 1.75, color: "var(--text-muted)", maxWidth: 260 }}>
              Connecting verified blood donors with patients in Dhaka Cantonment.
              Every drop counts — save a life today.
            </p>
          </div>

          {/* Platform links */}
          <div>
            <h3
              style={{
                fontWeight: 600,
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-faint)",
                marginBottom: "1rem",
              }}
            >
              Platform
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }} role="list">
              {PLATFORM_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="footer-link" style={{ fontSize: "0.9rem" }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Blood group search */}
          <div>
            <h3
              style={{
                fontWeight: 600,
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-faint)",
                marginBottom: "1rem",
              }}
            >
              Find by Blood Group
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {BLOOD_GROUPS.map((bg) => (
                <Link
                  key={bg}
                  href={`/find-donor?bloodGroup=${encodeURIComponent(bg)}`}
                  className="badge badge-red"
                  style={{ fontSize: "0.7rem" }}
                  aria-label={`Find ${bg} donors`}
                >
                  {bg}
                </Link>
              ))}
            </div>
          </div>

          {/* Account / Get started */}
          <div>
            <h3
              style={{
                fontWeight: 600,
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--text-faint)",
                marginBottom: "1rem",
              }}
            >
              Get Started
            </h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }} role="list">
              {[
                ["Register as Donor", "/register?role=donor"],
                ["Request Blood",     "/register?role=receiver"],
                ["Sign In",           "/login"],
                ["Contact Developer", "https://portfolio-abu-horaira.vercel.app/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  {href.startsWith("http") ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="footer-link" style={{ fontSize: "0.9rem" }}>
                      {label} ↗
                    </a>
                  ) : (
                    <Link href={href} className="footer-link" style={{ fontSize: "0.9rem" }}>
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.75rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>
            © {year} Cantt-Blood. Built with ❤️ to save lives in Dhaka Cantonment.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.78rem", color: "var(--text-faint)" }}>
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--success)",
                display: "inline-block",
                animation: "pulse-blood 2.4s infinite",
              }}
            />
            All systems operational
          </div>
        </div>

      </div>
    </footer>
  );
}
