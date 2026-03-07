"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, ChevronRight, LayoutDashboard, Droplets } from "lucide-react";

export default function HeroCTA() {
    const { data: session, status } = useSession();
    const role = (session?.user as any)?.role as string | undefined;

    if (status === "loading") return <div style={{ height: 52 }} />;

    if (session) {
        const dashHref =
            role === "admin" ? "/dashboard/admin"
            : role === "donor" ? "/dashboard/donor"
            : "/dashboard/receiver";

        return (
            <div className="hero-cta-group">
                <Link href={dashHref} className="btn-primary btn-hero">
                    <LayoutDashboard style={{ width: 20, height: 20 }} aria-hidden="true" />
                    Go to Dashboard
                </Link>
                {role === "donor" ? (
                    <Link href="/find-donor" className="btn-secondary btn-hero btn-hero-outline">
                        <Droplets style={{ width: 18, height: 18 }} aria-hidden="true" />
                        Find Requests
                    </Link>
                ) : role === "receiver" ? (
                    <Link href="/dashboard/receiver/new" className="btn-secondary btn-hero btn-hero-outline">
                        <Heart style={{ width: 18, height: 18 }} aria-hidden="true" />
                        Request Blood
                        <ChevronRight style={{ width: 16, height: 16 }} aria-hidden="true" />
                    </Link>
                ) : null}
            </div>
        );
    }

    return (
        <div className="hero-cta-group">
            <Link href="/register?role=donor" className="btn-primary btn-hero">
                <Heart style={{ width: 20, height: 20 }} aria-hidden="true" />
                Become a Donor
            </Link>
            <Link href="/register?role=receiver" className="btn-secondary btn-hero btn-hero-outline">
                Request Blood
                <ChevronRight style={{ width: 18, height: 18 }} aria-hidden="true" />
            </Link>
        </div>
    );
}
