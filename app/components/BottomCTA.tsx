"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, MapPin, LayoutDashboard, Droplets } from "lucide-react";

export default function BottomCTA() {
    const { data: session, status } = useSession();
    const role = (session?.user as any)?.role as string | undefined;

    if (status === "loading") return <div style={{ height: 52 }} />;

    if (session) {
        const dashHref =
            role === "admin"    ? "/dashboard/admin"
            : role === "donor"  ? "/dashboard/donor"
            : "/dashboard/receiver";

        return (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
                <Link href={dashHref} className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
                    <LayoutDashboard style={{ width: 20, height: 20 }} aria-hidden="true" />
                    Go to Dashboard
                </Link>
                {role === "donor" && (
                    <Link href="/find-donor" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
                        <MapPin style={{ width: 18, height: 18 }} aria-hidden="true" />
                        Find Blood Requests
                    </Link>
                )}
                {role === "receiver" && (
                    <Link href="/dashboard/receiver/new" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
                        <Droplets style={{ width: 18, height: 18 }} aria-hidden="true" />
                        Request Blood Now
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
            <Link href="/register?role=donor" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
                <Heart style={{ width: 20, height: 20 }} aria-hidden="true" />
                Register as Donor
            </Link>
            <Link href="/find-donor" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
                <MapPin style={{ width: 18, height: 18 }} aria-hidden="true" />
                Find Donors Near Me
            </Link>
        </div>
    );
}
