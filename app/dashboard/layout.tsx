"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShieldCheck, Settings, AlertCircle } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();

    // @ts-expect-error custom fields
    const role = session?.user?.role as string | null;
    // @ts-expect-error custom fields
    const nidStatus = session?.user?.nidStatus as string | null;

    if (!session) return null;

    const links = [];

    if (role === "admin") {
        links.push({ href: "/dashboard/admin", label: "Mission Control", icon: LayoutDashboard });
    } else if (role === "donor") {
        links.push({ href: "/dashboard/donor", label: "Donor Hub", icon: LayoutDashboard });
    } else if (role === "receiver") {
        links.push({ href: "/dashboard/receiver", label: "My Requests", icon: LayoutDashboard });
    }

    // Everyone sees verify NID if not verified
    if (nidStatus !== "approved") {
        links.push({ href: "/dashboard/verify-nid", label: "Verify Identity", icon: ShieldCheck });
    }

    return (
        <div className="dashboard-shell" style={{ paddingTop: 68 }}>
            {/* Sidebar */}
            <aside className="sidebar" style={{ display: undefined }} aria-label="Dashboard navigation">
                {/* User badge */}
                <div style={{
                    padding: "0.75rem",
                    marginBottom: "1.25rem",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                    border: "1px solid rgba(255,255,255,0.07)",
                }}>
                    <p style={{ fontSize: "0.68rem", fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Role</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className={`badge ${role === "admin" ? "badge-red" : role === "donor" ? "badge-green" : "badge-blue"}`} style={{ textTransform: "capitalize" }}>
                            {role}
                        </span>
                        {nidStatus === "approved" ? (
                            <ShieldCheck style={{ width: 16, height: 16, color: "#4ade80", flexShrink: 0 }} />
                        ) : (
                            <span title={`NID ${nidStatus}`}>
                                <AlertCircle style={{ width: 16, height: 16, color: "#fbbf24", flexShrink: 0 }} />
                            </span>
                        )}
                    </div>
                </div>

                <p className="sidebar-section-label">Navigation</p>
                <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`sidebar-link ${pathname === href ? "active" : ""}`}
                        >
                            <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                            {label}
                        </Link>
                    ))}
                    <Link href="/dashboard/settings" className={`sidebar-link ${pathname === "/dashboard/settings" ? "active" : ""}`}>
                        <Settings style={{ width: 16, height: 16, flexShrink: 0 }} />
                        Settings
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="dashboard-content">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
