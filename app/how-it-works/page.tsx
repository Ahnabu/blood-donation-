import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus, ShieldCheck, Droplets, Bell, HeartHandshake, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
    title: "How It Works — LifeLink Blood Donation Platform",
    description:
        "Learn how LifeLink connects blood donors with patients. Simple 3-step process: register & verify, get matched, and save lives. Fully automated with emergency STAT alerts.",
    alternates: { canonical: "/how-it-works" },
};

const DONOR_STEPS = [
    { icon: UserPlus, title: "Create Your Profile", desc: "Sign up with email, select 'Donor' role, set your blood group, district, age, weight, and answer a short medical questionnaire." },
    { icon: ShieldCheck, title: "Verify Your Identity", desc: "Upload a clear photo of your national ID (NID). Our admin team reviews and approves within 24 hours." },
    { icon: Bell, title: "Receive Alerts", desc: "When a compatible blood request is posted near you, you get an immediate notification via email or SMS." },
    { icon: HeartHandshake, title: "Donate & Save Lives", desc: "Go to the specified hospital or blood bank, donate, and your LifeLink profile logs the contribution automatically." },
];

const RECEIVER_STEPS = [
    { icon: UserPlus, title: "Register as Receiver", desc: "Sign up, select 'Receiver' role, and complete NID verification to unlock the blood request form." },
    { icon: Droplets, title: "Submit a Request", desc: "Fill in patient details, blood group, urgency level (Routine / Urgent / STAT), hospital name, and units needed." },
    { icon: Bell, title: "Track in Real-Time", desc: "Watch your request status move through Pending → Approved → In-Transit → Fulfilled in your dashboard." },
    { icon: HeartHandshake, title: "Receive Blood", desc: "Once approved, matched donors are contacted and inventory is checked. You receive updates at every step." },
];

export default function HowItWorksPage() {
    return (
        <div style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(220,38,38,0.1), transparent)" }}>
            {/* Hero */}
            <section className="section-sm">
                <div className="container mx-auto px-6 text-center">
                    <div className="badge badge-red mb-4">Step by Step</div>
                    <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>How LifeLink Works</h1>
                    <p className="text-gray-400 mt-4" style={{ maxWidth: 560, margin: "1rem auto 0", fontSize: "1.1rem" }}>
                        We&apos;ve simplified blood donation into a few steps — for both donors and patients.
                    </p>
                </div>
            </section>

            {/* Donor Journey */}
            <section className="section">
                <div className="container mx-auto px-6">
                    <h2 className="mb-10" style={{ fontSize: "1.75rem" }}>
                        🩸 For <span className="gradient-text">Donors</span>
                    </h2>
                    <div className="grid-4">
                        {DONOR_STEPS.map(({ icon: Icon, title, desc }, i) => (
                            <div key={title} className="glass" style={{ padding: "1.75rem", position: "relative" }}>
                                <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "2.5rem", fontWeight: 800, color: "rgba(220,38,38,0.08)", lineHeight: 1 }}>{i + 1}</div>
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(220,38,38,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                                    <Icon className="w-5 h-5 text-red-400" />
                                </div>
                                <h3 className="mb-2" style={{ fontSize: "1.05rem" }}>{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Link href="/register?role=donor" className="btn-primary">Register as Donor <ChevronRight className="w-4 h-4" /></Link>
                    </div>
                </div>
            </section>

            {/* Receiver Journey */}
            <section className="section" style={{ background: "rgba(17,24,39,0.4)" }}>
                <div className="container mx-auto px-6">
                    <h2 className="mb-10" style={{ fontSize: "1.75rem" }}>
                        🏥 For <span className="gradient-text">Patients & Hospitals</span>
                    </h2>
                    <div className="grid-4">
                        {RECEIVER_STEPS.map(({ icon: Icon, title, desc }, i) => (
                            <div key={title} className="glass" style={{ padding: "1.75rem", position: "relative" }}>
                                <div style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "2.5rem", fontWeight: 800, color: "rgba(220,38,38,0.08)", lineHeight: 1 }}>{i + 1}</div>
                                <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                                    <Icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <h3 className="mb-2" style={{ fontSize: "1.05rem" }}>{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8">
                        <Link href="/register?role=receiver" className="btn-secondary">Request Blood <ChevronRight className="w-4 h-4" /></Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
