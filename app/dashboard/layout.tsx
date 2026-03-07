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
        <div className="dashboard-shell pt-16">
            {/* Sidebar */}
            <aside className="sidebar hidden md:block" style={{ height: "calc(100vh - 64px)", top: 64 }}>
                <div className="mb-6 px-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Role</p>
                    <div className="flex items-center gap-2">
                        <span className={`badge ${role === "admin" ? "badge-red" : role === "donor" ? "badge-green" : "badge-blue"}`}>
                            {role}
                        </span>
                        {nidStatus === "approved" ? (
                            <ShieldCheck className="w-4 h-4 text-green-400" />
                        ) : (
                            <span title={`NID ${nidStatus}`}>
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                            </span>
                        )}
                    </div>
                </div>

                <nav className="flex flex-col gap-1">
                    {links.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`sidebar-link ${pathname === href ? "active" : ""}`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                    <Link href="/dashboard/settings" className={`sidebar-link ${pathname === "/dashboard/settings" ? "active" : ""}`}>
                        <Settings className="w-4 h-4" />
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
