"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Heart, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
    const { data: session } = useSession();
    const [mobileOpen, setMobileOpen] = useState(false);

    // @ts-expect-error custom fields
    const role = session?.user?.role as string | undefined;
    const dashPath = role ? `/dashboard/${role}` : null;

    return (
        <header className="sticky top-0 z-50 glass-strong border-b border-white/5">
            <nav className="container flex items-center justify-between h-16 px-6 mx-auto">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Heart className="w-6 h-6 text-red-500 fill-red-500 animate-pulse-blood" />
                    <span className="gradient-text">LifeLink</span>
                </Link>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">Home</Link>
                    <Link href="/how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">How it Works</Link>
                    <Link href="/blood-types" className="text-sm text-gray-400 hover:text-white transition-colors">Blood Types</Link>
                    <Link href="/find-donor" className="text-sm text-gray-400 hover:text-white transition-colors">Find Donor</Link>
                    <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
                </div>

                {/* Auth actions */}
                <div className="hidden md:flex items-center gap-3">
                    {session ? (
                        <>
                            {dashPath && (
                                <Link href={dashPath} className="btn-secondary text-sm py-2 px-4">
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
                            <Link href="/register" className="btn-primary text-sm py-2 px-4">
                                <Heart className="w-4 h-4" />
                                Donate Now
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile burger */}
                <button
                    className="md:hidden text-gray-400 hover:text-white"
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </nav>

            {/* Mobile dropdown */}
            {mobileOpen && (
                <div className="md:hidden glass border-t border-white/5 px-6 py-4 flex flex-col gap-4">
                    {[" /", "/how-it-works", "/blood-types", "/find-donor", "/blog"].map((href) => (
                        <Link
                            key={href}
                            href={href.trim()}
                            className="text-sm text-gray-300 hover:text-white"
                            onClick={() => setMobileOpen(false)}
                        >
                            {href.trim() === "/" ? "Home" : href.replace("/", "").replace("-", " ").replace(/\b\w/g, c => c.toUpperCase())}
                        </Link>
                    ))}
                    <hr className="border-white/10" />
                    {session ? (
                        <>
                            {dashPath && <Link href={dashPath} className="btn-secondary text-sm" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
                            <button onClick={() => signOut({ callbackUrl: "/" })} className="text-sm text-left text-gray-400">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="btn-secondary text-sm text-center" onClick={() => setMobileOpen(false)}>Sign In</Link>
                            <Link href="/register" className="btn-primary text-sm text-center" onClick={() => setMobileOpen(false)}>Register</Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
