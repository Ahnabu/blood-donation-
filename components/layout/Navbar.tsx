"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Heart, Menu, X, LayoutDashboard, LogOut, Droplets } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Blood Types",  href: "/blood-types" },
  { label: "Find Donor",   href: "/find-donor" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // @ts-expect-error custom fields
  const role = session?.user?.role as string | undefined;
  const dashPath = role ? `/dashboard/${role}` : null;
  const close = () => setMobileOpen(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "rgba(8, 12, 20, 0.85)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* thin crimson accent line at top */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, var(--primary), transparent)",
          opacity: 0.6,
        }}
      />

      <nav
        className="container flex items-center justify-between mx-auto px-4 md:px-6"
        style={{ height: 68 }}
      >
        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0"
          style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              height: 34,
              borderRadius: "10px",
              background: "linear-gradient(135deg, rgba(230,57,70,0.25), rgba(193,18,31,0.15))",
              border: "1px solid rgba(230,57,70,0.35)",
            }}
          >
            <Droplets className="w-4 h-4" style={{ color: "var(--primary)" }} aria-hidden="true" />
          </span>
          <span className="gradient-text">Cantt-Blood</span>
        </Link>

        {/* ── Desktop Nav ──────────────────────────────────────── */}
        <ul
          className="hidden md:flex items-center list-none"
          role="list"
          style={{ gap: "0.25rem" }}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="nav-link"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "0.5rem 0.9rem",
                    borderRadius: "8px",
                    fontSize: "0.875rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--text)" : "var(--text-muted)",
                    background: active ? "rgba(255,255,255,0.06)" : "transparent",
                    transition: "all 0.18s ease",
                    position: "relative",
                  }}
                >
                  {label}
                  {active && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: "absolute",
                        bottom: 4,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 18,
                        height: 2,
                        borderRadius: 99,
                        background: "var(--primary)",
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── Auth Actions ─────────────────────────────────────── */}
        <div className="hidden md:flex items-center shrink-0" style={{ gap: "0.5rem" }}>
          {session ? (
            <>
              {dashPath && (
                <Link
                  href={dashPath}
                  className="flex items-center gap-1.5"
                  style={{
                    padding: "0.45rem 1rem",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    borderRadius: "8px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text)",
                    transition: "all 0.18s ease",
                  }}
                >
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                  Dashboard
                </Link>
              )}
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5"
                style={{
                  padding: "0.45rem 1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  borderRadius: "8px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  padding: "0.45rem 1.1rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  borderRadius: "8px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-muted)",
                  transition: "all 0.18s ease",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5"
                style={{
                  padding: "0.45rem 1.25rem",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, var(--primary), #c1121f)",
                  color: "#fff",
                  boxShadow: "0 0 18px rgba(230,57,70,0.35)",
                  transition: "all 0.18s ease",
                }}
              >
                <Heart className="w-4 h-4 fill-white" aria-hidden="true" />
                Donate Now
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Burger ────────────────────────────────────── */}
        <button
          className="md:hidden"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: "9px",
            background: mobileOpen ? "rgba(230,57,70,0.12)" : "rgba(255,255,255,0.05)",
            border: `1px solid ${mobileOpen ? "rgba(230,57,70,0.3)" : "rgba(255,255,255,0.09)"}`,
            color: mobileOpen ? "var(--primary)" : "var(--text-muted)",
            cursor: "pointer",
            transition: "all 0.18s ease",
          }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
        </button>
      </nav>

      {/* ── Mobile Menu ──────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden"
          style={{
            background: "rgba(9, 13, 22, 0.98)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "1rem 1.25rem 1.5rem",
          }}
        >
          <ul className="flex flex-col list-none" role="list" style={{ gap: "0.25rem", marginBottom: "1rem" }}>
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={close}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.625rem",
                      padding: "0.75rem 1rem",
                      borderRadius: "10px",
                      fontSize: "0.9rem",
                      fontWeight: active ? 600 : 400,
                      color: active ? "var(--text)" : "var(--text-muted)",
                      background: active ? "rgba(230,57,70,0.1)" : "transparent",
                      borderLeft: active ? "2px solid var(--primary)" : "2px solid transparent",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div
            style={{
              margin: "0.75rem 0",
              height: 1,
              background: "rgba(255,255,255,0.06)",
            }}
          />

          {session ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {dashPath && (
                <Link
                  href={dashPath}
                  onClick={close}
                  className="flex items-center justify-center gap-2"
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text)",
                  }}
                >
                  <LayoutDashboard className="w-4 h-4" aria-hidden="true" /> Dashboard
                </Link>
              )}
              <button
                onClick={() => { close(); signOut({ callbackUrl: "/" }); }}
                className="flex items-center justify-center gap-2"
                style={{
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <LogOut className="w-4 h-4" aria-hidden="true" /> Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <Link
                href="/login"
                onClick={close}
                style={{
                  display: "block",
                  textAlign: "center",
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "var(--text-muted)",
                }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={close}
                className="flex items-center justify-center gap-2"
                style={{
                  padding: "0.75rem",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  background: "linear-gradient(135deg, var(--primary), #c1121f)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(230,57,70,0.3)",
                }}
              >
                <Heart className="w-4 h-4 fill-white" aria-hidden="true" />
                Register &amp; Donate
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
