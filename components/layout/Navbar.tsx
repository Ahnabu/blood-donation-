"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import {
  Droplets, Menu, X, LayoutDashboard, LogOut, Heart,
  Home, Info, BookHeart, Search, ChevronDown,
} from "lucide-react";
// nav-desktop / nav-mobile / nav-burger CSS classes are defined in globals.css

const NAV_LINKS = [
  { label: "Home",         href: "/",             icon: Home },
  { label: "How It Works", href: "/how-it-works",  icon: Info },
  { label: "Blood Types",  href: "/blood-types",   icon: BookHeart },
  { label: "Find Donor",   href: "/find-donor",    icon: Search },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // @ts-expect-error custom fields
  const role = session?.user?.role as string | undefined;
  const userName = session?.user?.name as string | undefined;
  const dashPath = role ? `/dashboard/${role}` : null;

  const close = () => setMobileOpen(false);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Elevate navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const initials = userName
    ? userName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : role?.[0]?.toUpperCase() ?? "U";

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{
          background: scrolled
            ? "rgba(6, 9, 18, 0.96)"
            : "rgba(8, 12, 20, 0.82)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderBottom: scrolled
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: scrolled ? "0 4px 32px rgba(0,0,0,0.4)" : "none",
          transition: "background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        }}
      >
        {/* Crimson top accent — hidden on mobile */}
        <div
          aria-hidden="true"
          className="nav-accent-bar"
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent 0%, var(--primary) 40%, #ff6b7a 60%, transparent 100%)",
            opacity: 0.7,
          }}
        />

        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0.35rem 1.25rem 0",
            height: 68,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* ── Logo ─────────────────────────────────────────── */}
          <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontWeight: 800,
                fontSize: "1.18rem",
                letterSpacing: "-0.03em",
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, rgba(230,57,70,0.3) 0%, rgba(193,18,31,0.18) 100%)",
                  border: "1px solid rgba(230,57,70,0.4)",
                  boxShadow: "0 0 14px rgba(230,57,70,0.2)",
                  flexShrink: 0,
                }}
              >
                <Droplets style={{ width: 17, height: 17, color: "var(--primary)" }} aria-hidden="true" />
              </span>
              <span
                style={{
                  background: "linear-gradient(135deg, #f0f4ff 0%, #e63946 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Cantt-Blood
              </span>
            </Link>
          </div>

          {/* ── Desktop Nav (centred) — hidden on mobile via CSS ── */}
          <nav aria-label="Main navigation" className="nav-desktop">
            <ul
              role="list"
              style={{
                listStyle: "none",
                margin: 0,
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: "0.125rem",
              }}
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
                        padding: "0.5rem 1rem",
                        borderRadius: "9px",
                        fontSize: "0.875rem",
                        fontWeight: active ? 600 : 500,
                        color: active ? "#fff" : "var(--text-muted)",
                        background: active
                          ? "linear-gradient(135deg, rgba(230,57,70,0.18), rgba(193,18,31,0.1))"
                          : "transparent",
                        border: active
                          ? "1px solid rgba(230,57,70,0.28)"
                          : "1px solid transparent",
                        transition: "all 0.18s ease",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Desktop Auth — hidden on mobile via CSS ─────────── */}
          <div
            className="nav-desktop"
            style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", gap: "0.5rem" }}
          >
            {status === "loading" ? (
              <div style={{
                width: 80, height: 32, borderRadius: 8,
                background: "rgba(255,255,255,0.06)",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ) : session ? (
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.35rem 0.75rem 0.35rem 0.35rem",
                    borderRadius: "99px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    color: "var(--text)",
                    cursor: "pointer",
                    transition: "all 0.18s ease",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  <span
                    style={{
                      width: 28, height: 28,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--primary), #c1121f)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "0.7rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                    }}
                  >
                    {initials}
                  </span>
                  <span style={{ maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {userName ?? role}
                  </span>
                  <ChevronDown
                    style={{
                      width: 14, height: 14,
                      color: "var(--text-muted)",
                      transition: "transform 0.2s ease",
                      transform: userMenuOpen ? "rotate(180deg)" : "none",
                    }}
                    aria-hidden="true"
                  />
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      minWidth: 180,
                      background: "rgba(10, 15, 27, 0.98)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                      backdropFilter: "blur(16px)",
                      overflow: "hidden",
                      zIndex: 100,
                    }}
                  >
                    {dashPath && (
                      <Link
                        href={dashPath}
                        onClick={() => setUserMenuOpen(false)}
                        className="dropdown-item"
                        style={{
                          display: "flex", alignItems: "center", gap: "0.625rem",
                          padding: "0.75rem 1rem", fontSize: "0.875rem",
                          color: "var(--text)", textDecoration: "none", transition: "background 0.15s",
                        }}
                      >
                        <LayoutDashboard style={{ width: 15, height: 15 }} aria-hidden="true" />
                        Dashboard
                      </Link>
                    )}
                    <div style={{ height: 1, background: "rgba(255,255,255,0.07)" }} />
                    <button
                      onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                      className="dropdown-item"
                      style={{
                        display: "flex", alignItems: "center", gap: "0.625rem",
                        padding: "0.75rem 1rem", fontSize: "0.875rem",
                        color: "#ff8a8a", background: "transparent", border: "none",
                        cursor: "pointer", width: "100%", textAlign: "left", transition: "background 0.15s",
                      }}
                    >
                      <LogOut style={{ width: 15, height: 15 }} aria-hidden="true" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="nav-ghost-btn"
                  style={{
                    padding: "0.45rem 1.1rem",
                    fontSize: "0.875rem", fontWeight: 500,
                    borderRadius: "8px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.13)",
                    color: "var(--text-muted)",
                    transition: "all 0.18s ease",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="nav-cta-btn"
                  style={{
                    display: "flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.48rem 1.2rem",
                    fontSize: "0.875rem", fontWeight: 700,
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #e63946, #c1121f)",
                    color: "#fff",
                    boxShadow: "0 2px 20px rgba(230,57,70,0.38)",
                    transition: "all 0.18s ease",
                    textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  <Heart style={{ width: 14, height: 14, fill: "#fff" }} aria-hidden="true" />
                  Donate Now
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Burger — hidden on desktop via CSS ────────── */}
          <button
            className="nav-burger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            style={{
              marginLeft: "auto",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "10px",
              background: mobileOpen
                ? "linear-gradient(135deg, rgba(230,57,70,0.2), rgba(193,18,31,0.12))"
                : "rgba(255,255,255,0.05)",
              border: `1px solid ${mobileOpen ? "rgba(230,57,70,0.35)" : "rgba(255,255,255,0.1)"}`,
              color: mobileOpen ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
          >
            {mobileOpen
              ? <X style={{ width: 20, height: 20 }} />
              : <Menu style={{ width: 20, height: 20 }} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer Overlay ──────────────────────────────── */}
      {mobileOpen && (
        <div
          aria-hidden="true"
          onClick={close}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 250,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* ── Mobile Drawer ──────────────────────────────────────── */}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className="nav-mobile-drawer"
        style={{
          position: "fixed",
          top: 68,
          left: 0,
          right: 0,
          zIndex: 300,
          background: "rgba(7, 11, 21, 0.99)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          transform: mobileOpen ? "translateY(0)" : "translateY(-110%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: "1.25rem 1.5rem 2rem",
          maxHeight: "calc(100svh - 68px)",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      >
        {/* Nav links */}
        <ul
          role="list"
          style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          {NAV_LINKS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.8rem 1rem",
                    borderRadius: "11px",
                    fontSize: "0.9375rem",
                    fontWeight: active ? 600 : 400,
                    color: active ? "#fff" : "var(--text-muted)",
                    background: active
                      ? "linear-gradient(135deg, rgba(230,57,70,0.15), rgba(193,18,31,0.08))"
                      : "transparent",
                    borderLeft: `3px solid ${active ? "var(--primary)" : "transparent"}`,
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Icon
                    style={{
                      width: 17,
                      height: 17,
                      color: active ? "var(--primary)" : "var(--text-faint)",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "0.875rem 0" }} />

        {/* Auth section */}
        {session ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {/* User badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "11px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                marginBottom: "0.25rem",
              }}
            >
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary), #c1121f)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {initials}
              </span>
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>
                  {userName ?? "Account"}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-faint)", margin: 0, textTransform: "capitalize" }}>
                  {role}
                </p>
              </div>
            </div>

            {dashPath && (
              <Link
                href={dashPath}
                onClick={close}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  padding: "0.8rem",
                  borderRadius: "11px",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "var(--text)",
                  textDecoration: "none",
                }}
              >
                <LayoutDashboard style={{ width: 16, height: 16 }} aria-hidden="true" />
                Go to Dashboard
              </Link>
            )}
            <button
              onClick={() => { close(); signOut({ callbackUrl: "/" }); }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.8rem",
                borderRadius: "11px",
                fontWeight: 500,
                fontSize: "0.9rem",
                background: "rgba(230,57,70,0.07)",
                border: "1px solid rgba(230,57,70,0.18)",
                color: "#ff8a8a",
                cursor: "pointer",
              }}
            >
              <LogOut style={{ width: 16, height: 16 }} aria-hidden="true" />
              Sign Out
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
                padding: "0.8rem",
                borderRadius: "11px",
                fontWeight: 500,
                fontSize: "0.9rem",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.13)",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={close}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.8rem",
                borderRadius: "11px",
                fontWeight: 700,
                fontSize: "0.9rem",
                background: "linear-gradient(135deg, #e63946, #c1121f)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(230,57,70,0.3)",
                textDecoration: "none",
              }}
            >
              <Heart style={{ width: 16, height: 16, fill: "#fff" }} aria-hidden="true" />
              Register &amp; Donate
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
