import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Users, Droplets, MapPin, Shield, ChevronRight, CheckCircle } from "lucide-react";
import { COMPATIBLE_DONORS } from "@/lib/matching";

export const metadata: Metadata = {
  title: "LifeLink — Connect Blood Donors, Save Lives",
  description:
    "Bangladesh's fastest blood donor-receiver matching platform. Find compatible blood donors nearby in seconds. Register as a donor or request blood in emergencies.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "LifeLink — Connect Blood Donors, Save Lives",
    description: "Find compatible blood donors in seconds. Register as a donor or request blood.",
    url: "/",
  },
};

const STATS = [
  { value: "12,400+", label: "Registered Donors" },
  { value: "8,900+", label: "Lives Saved" },
  { value: "3.2 min", label: "Avg Match Time" },
  { value: "64", label: "Districts Covered" },
];

const STEPS = [
  {
    icon: Users,
    title: "Register & Verify",
    desc: "Sign up, choose your role (Donor or Receiver), and verify your identity with a national ID.",
  },
  {
    icon: Droplets,
    title: "Match Instantly",
    desc: "Our algorithm matches your blood group to compatible donors within your area using real-time proximity data.",
  },
  {
    icon: Heart,
    title: "Save a Life",
    desc: "Donors are notified immediately. Track request status in real-time until fulfillment.",
  },
];

const FAQS = [
  {
    q: "How do I become a blood donor?",
    a: "Register, complete your donor profile, upload a valid NID, and wait for admin verification. The entire process takes less than 5 minutes.",
  },
  {
    q: "How often can I donate blood?",
    a: "Whole blood donors must wait at least 56 days (8 weeks) between donations. Our system automatically calculates and shows your next eligible date.",
  },
  {
    q: "Is my personal information safe?",
    a: "Yes. Your NID photo is stored in an encrypted, private bucket. Public donor profiles only show blood group and district — never personal contact details.",
  },
  {
    q: "What blood groups are accepted?",
    a: "All 8 ABO+Rh blood groups: A+, A−, B+, B−, AB+, AB−, O+, and O−.",
  },
  {
    q: "How does the emergency STAT request work?",
    a: "STAT requests bypass standard queues. Compatible donors within 10 km receive an immediate SMS/email alert. Stock in the blood bank is also checked simultaneously.",
  },
];

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "LifeLink",
      url: "/",
      description: "Blood donor-receiver matching platform",
      logo: "/og-image.png",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(220,38,38,0.15), transparent)",
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        <div className="container mx-auto px-6 relative">
          <div style={{ maxWidth: 740 }} className="animate-fade-in-up">
            <div className="badge badge-red mb-6" style={{ fontSize: "0.8rem" }}>
              🩸 Bangladesh&apos;s #1 Blood Matching Platform
            </div>

            <h1 className="mb-6">
              Every Drop of Blood is a{" "}
              <span className="gradient-text">Lifeline</span>
            </h1>

            <p
              className="text-gray-400 mb-10"
              style={{ fontSize: "1.2rem", maxWidth: 560, lineHeight: 1.7 }}
            >
              Connect with verified blood donors near you in minutes. Whether it&apos;s a
              scheduled surgery or an emergency, LifeLink bridges the gap between donors
              and patients instantly.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register?role=donor" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
                <Heart className="w-5 h-5" />
                Become a Donor
              </Link>
              <Link href="/register?role=receiver" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.875rem 2rem" }}>
                Request Blood
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {["Free to use", "Verified donors", "Emergency STAT alerts", "All 64 districts"].map((f) => (
                <span key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Floating blood drop */}
        <div
          className="animate-float blood-drop-glow"
          style={{
            position: "absolute",
            right: "8%",
            top: "50%",
            transform: "translateY(-50%)",
            display: "none",
          }}
        >
          <svg width="200" height="260" viewBox="0 0 100 130" fill="none">
            <path
              d="M50 10 C50 10 15 60 15 80 C15 100 30 115 50 115 C70 115 85 100 85 80 C85 60 50 10 50 10Z"
              fill="url(#blood-gradient)"
            />
            <defs>
              <radialGradient id="blood-gradient" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </section>

      {/* ── Stats Strip ──────────────────────────────────────────── */}
      <section className="section-sm" style={{ background: "rgba(17,24,39,0.5)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="container mx-auto px-6">
          <div className="grid-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="stat-card">
                <div className="stat-number">{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="badge badge-red mb-4">Simple Process</div>
            <h2>How LifeLink Works</h2>
            <p className="text-gray-400 mt-4" style={{ maxWidth: 500, margin: "1rem auto 0" }}>
              Three simple steps stand between a donor and saving a life.
            </p>
          </div>

          <div className="grid-3">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="glass" style={{ padding: "2rem", position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    top: "1.5rem",
                    right: "1.5rem",
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: "rgba(220,38,38,0.1)",
                    lineHeight: 1,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  className="animate-pulse-blood"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: "rgba(220,38,38,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1.25rem",
                  }}
                >
                  <Icon className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="mb-3">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/how-it-works" className="btn-secondary">
              Learn More <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blood Compatibility Teaser ────────────────────────────── */}
      <section className="section" style={{ background: "rgba(17,24,39,0.4)" }}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="badge badge-red mb-4">Compatibility</div>
            <h2>Which Blood Groups Are Compatible?</h2>
            <p className="text-gray-400 mt-4">
              Our matching engine uses the complete ABO + RhD compatibility matrix.
            </p>
          </div>

          <div className="glass" style={{ overflowX: "auto", padding: "1.5rem" }}>
            <table className="table-auto" style={{ minWidth: 600 }}>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Compatible Donor Blood Groups</th>
                </tr>
              </thead>
              <tbody>
                {(Object.entries(COMPATIBLE_DONORS) as [string, string[]][]).map(
                  ([recipient, donors]) => (
                    <tr key={recipient}>
                      <td>
                        <span className="badge badge-red">{recipient}</span>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {donors.map((d) => (
                            <span key={d} className="badge badge-gray text-xs">
                              {d}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="text-center mt-8">
            <Link href="/blood-types" className="btn-secondary">
              View Full Chart <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-sm mx-auto px-6">
          <div className="text-center mb-12">
            <div className="badge badge-red mb-4">FAQ</div>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {FAQS.map(({ q, a }) => (
              <details
                key={q}
                className="glass"
                style={{ padding: "1.5rem", cursor: "pointer" }}
              >
                <summary
                  style={{
                    fontWeight: 600,
                    fontSize: "1rem",
                    color: "white",
                    listStyle: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {q}
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed mt-4">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="section" style={{ background: "linear-gradient(135deg, rgba(220,38,38,0.1), rgba(185,28,28,0.05))", borderTop: "1px solid rgba(220,38,38,0.15)" }}>
        <div className="container mx-auto px-6 text-center">
          <Heart
            className="w-12 h-12 text-red-500 fill-red-500 mx-auto mb-6 animate-pulse-blood"
          />
          <h2 className="mb-4">Ready to Save a Life?</h2>
          <p className="text-gray-400 mb-8" style={{ maxWidth: 480, margin: "0 auto 2rem" }}>
            It only takes 10 minutes to donate. Your blood could save up to 3 lives.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register?role=donor" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
              <Heart className="w-5 h-5" />
              Register as Donor
            </Link>
            <Link href="/find-donor" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
              <MapPin className="w-4 h-4" />
              Find Donors Near Me
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
