import Link from "next/link";
import { Heart } from "lucide-react";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Footer() {
    return (
        <footer className="border-t border-white/5 bg-gray-950/80">
            <div className="container mx-auto px-6 py-16">
                <div className="grid-4 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                            <span className="gradient-text">LifeLink</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Connecting blood donors with patients in need. Every drop counts — save a life today.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Platform</h3>
                        <ul className="space-y-2">
                            {[["Find a Donor", "/find-donor"], ["Request Blood", "/register"], ["How It Works", "/how-it-works"], ["Blood Types Chart", "/blood-types"]].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Blood groups quick search */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Find by Blood Group</h3>
                        <div className="flex flex-wrap gap-2">
                            {BLOOD_GROUPS.map((bg) => (
                                <Link
                                    key={bg}
                                    href={`/find-donor?bloodGroup=${encodeURIComponent(bg)}`}
                                    className="badge badge-red text-xs"
                                >
                                    {bg}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Legal</h3>
                        <ul className="space-y-2">
                            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Data Protection", "/privacy#gdpr"]].map(([label, href]) => (
                                <li key={href}>
                                    <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} LifeLink. Built with ❤️ to save lives.
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                        All systems operational
                    </div>
                </div>
            </div>
        </footer>
    );
}
