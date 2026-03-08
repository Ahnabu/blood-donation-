"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldCheck, Settings, AlertCircle, Users, Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const mq = window.matchMedia("(max-width: 767px)");
        setIsMobile(mq.matches);
        const onChange = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
            if (!e.matches) setMobileOpen(false);
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    // @ts-expect-error custom fields
    const role = session?.user?.role as string | null;
    // @ts-expect-error custom fields
    const nidStatus = session?.user?.nidStatus as string | null;

    if (!session) return null;

    const links: Array<{ href: string; label: string; icon: React.ElementType }> = [];

    if (role === "admin") {
        links.push({ href: "/dashboard/admin", label: "Mission Control", icon: LayoutDashboard });
        links.push({ href: "/dashboard/admin/requests", label: "Requests", icon: AlertCircle });
        links.push({ href: "/dashboard/admin/nid", label: "NID Queue", icon: ShieldCheck });
        links.push({ href: "/dashboard/admin/users", label: "Users", icon: Users });
    } else if (role === "donor") {
        links.push({ href: "/dashboard/donor", label: "Donor Hub", icon: LayoutDashboard });
    } else if (role === "receiver") {
        links.push({ href: "/dashboard/receiver", label: "My Requests", icon: LayoutDashboard });
    }

    if (nidStatus !== "approved") {
        links.push({ href: "/dashboard/verify-nid", label: "Verify Identity", icon: ShieldCheck });
    }

    const allLinks = [...links, { href: "/dashboard/settings", label: "Settings", icon: Settings }];
    const badgeClass = role === "admin" ? "badge-red" : role === "donor" ? "badge-green" : "badge-blue";

    const userBadge = (
        <div style={{
            padding: "0.75rem",
            marginBottom: "1.25rem",
            background: "rgba(255,255,255,0.03)",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.07)",
        }}>
            <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Role</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className={`badge ${badgeClass}`} style={{ textTransform: "capitalize" }}>{role}</span>
                {nidStatus === "approved"
                    ? <ShieldCheck style={{ width: 16, height: 16, color: "#4ade80", flexShrink: 0 }} />
                    : <AlertCircle style={{ width: 16, height: 16, color: "#fbbf24", flexShrink: 0 }} title={`NID ${nidStatus}`} />
                }
            </div>
        </div>
    );

    const navLinks = (onClick?: () => void) => (
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {allLinks.map(({ href, label, icon: Icon }) => (
                <Link
                    key={href}
                    href={href}
                    className={`sidebar-link ${pathname === href ? "active" : ""}`}
                    onClick={onClick}
                >
                    <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                    {label}
                </Link>
            ))}
        </nav>
    );

    return (
        <div className="dashboard-shell">

            {/* Mobile only ── */}
            {isMobile && (
                <>
                    {/* Top bar with hamburger — fixed at top:68px */}
                    <div className="mobile-nav-bar">
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <span className={`badge ${badgeClass}`} style={{ textTransform: "capitalize" }}>{role}</span>
                            {nidStatus === "approved"
                                ? <ShieldCheck style={{ width: 14, height: 14, color: "#4ade80" }} />
                                : <AlertCircle style={{ width: 14, height: 14, color: "#fbbf24" }} title={`NID ${nidStatus}`} />
                            }
                        </div>
                        <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen}>
                            <Menu style={{ width: 22, height: 22 }} />
                        </button>
                    </div>

                    {/* Backdrop */}
                    {mobileOpen && (
                        <div className="mobile-nav-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />
                    )}

                    {/* Slide-out drawer */}
                    <div className={`mobile-nav-drawer${mobileOpen ? " open" : ""}`} aria-label="Mobile navigation">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                            <span style={{ fontWeight: 700, color: "var(--text)" }}>Menu</span>
                            <button className="mobile-menu-btn" onClick={() => setMobileOpen(false)} aria-label="Close navigation">
                                <X style={{ width: 22, height: 22 }} />
                            </button>
                        </div>
                        {userBadge}
                        <p className="sidebar-section-label">Navigation</p>
                        {navLinks(() => setMobileOpen(false))}
                    </div>
                </>
            )}

            {/* ── Desktop only: persistent sidebar ── */}
            {!isMobile && (
                <aside className="sidebar" aria-label="Dashboard navigation">
                    {userBadge}
                    <p className="sidebar-section-label">Navigation</p>
                    {navLinks()}
                </aside>
            )}

            {/* Main Content */}
            <main className="dashboard-content">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
