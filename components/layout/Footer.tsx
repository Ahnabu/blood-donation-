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
      <div className="container mx-auto px-4 md:px-6" style={{ paddingTop: "3.5rem", paddingBottom: "3.5rem" }}>

        {/* ── Main grid ───────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem 2rem",
            marginBottom: "3rem",
            alignItems: "start",
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: 280 }}>
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl mb-4" style={{ display: "flex" }}>
              <Heart className="w-6 h-6 text-red-500 fill-red-500" aria-hidden="true" />
              <span className="gradient-text">Cantt-Blood</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
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
            <ul className="flex flex-col gap-2 list-none" role="list">
              {PLATFORM_LINKS.map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="footer-link text-sm"
                  >
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
            <div className="flex flex-wrap gap-2">
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
            <ul className="flex flex-col gap-2 list-none" role="list">
              {[
                ["Register as Donor", "/register?role=donor"],
                ["Request Blood",     "/register?role=receiver"],
                ["Sign In",           "/login"],
                ["Contact Developer", "https://portfolio-abu-horaira.vercel.app/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  {href.startsWith("http") ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="footer-link text-sm"
                    >
                      {label} ↗
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="footer-link text-sm"
                    >
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

          <div className="flex items-center gap-1.5" style={{ fontSize: "0.78rem", color: "var(--text-faint)" }}>
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
