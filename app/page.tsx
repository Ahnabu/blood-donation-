import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Users, Droplets, MapPin, Shield, ChevronRight, CheckCircle } from "lucide-react";
import { COMPATIBLE_DONORS } from "@/lib/matching";

export const metadata: Metadata = {
  title: "Cantt-Blood — Connect Blood Donors, Save Lives",
  description:
    "Dhaka Cantonment's fastest blood donor-receiver matching platform. Find compatible blood donors nearby in seconds. Register as a donor or request blood in emergencies.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Cantt-Blood — Connect Blood Donors, Save Lives",
    description: "Find compatible blood donors in seconds. Register as a donor or request blood.",
    url: "/",
  },
};

const STATS = [
  { value: "1,400+", label: "Registered Donors" },
  { value: "900+",   label: "Lives Saved" },
  { value: "3.2 min",label: "Avg Match Time" },
  { value: "Dhaka",  label: "Cantonment Area" },
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
  {
    q: "Having issues or want to talk to the developer?",
    a: "CONTACT_LINK",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Cantt-Blood",
      url: "/",
      description: "Blood donor-receiver matching platform in Dhaka Cantonment",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.slice(0, 5).map(({ q, a }) => ({
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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% -10%, rgba(230,57,70,0.18) 0%, transparent 70%)",
          minHeight: "92vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* Dot grid */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* Floating blood drop (lg+) */}
        <div
          className="animate-float blood-drop-glow"
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "6%",
            top: "50%",
            transform: "translateY(-50%)",
            display: "none",
          }}
        >
          <svg width="210" height="270" viewBox="0 0 100 130" fill="none" aria-hidden="true">
            <path
              d="M50 10 C50 10 15 60 15 80 C15 100 30 115 50 115 C70 115 85 100 85 80 C85 60 50 10 50 10Z"
              fill="url(#blood-gradient)"
            />
            <defs>
              <radialGradient id="blood-gradient" cx="40%" cy="40%">
                <stop offset="0%" stopColor="#ff6b6b" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
          <div className="animate-fade-in-up" style={{ maxWidth: 720 }}>
            {/* Eyebrow badge */}
            <div className="badge badge-red mb-6" style={{ fontSize: "0.78rem" }}>
              Dhaka Cantonment&apos;s Blood Matching Platform
            </div>

            <h1 className="mb-5">
              Every Drop of Blood{" "}
              <br className="hidden sm:block" />
              is a{" "}
              <span className="gradient-text">Lifeline</span>
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.2rem)",
                maxWidth: 560,
                lineHeight: 1.75,
                marginBottom: "2.5rem",
                color: "var(--text-muted)",
              }}
            >
              Connect with verified blood donors near you in minutes. Whether it&apos;s a
              scheduled surgery or an emergency, Cantt-Blood bridges the gap between
              donors and patients instantly within the Cantonment area.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3" style={{ marginBottom: "2.5rem" }}>
              <Link
                href="/register?role=donor"
                className="btn-primary"
                style={{ fontSize: "1rem", padding: "0.875rem 2.25rem" }}
              >
                <Heart className="w-5 h-5" aria-hidden="true" />
                Become a Donor
              </Link>
              <Link
                href="/register?role=receiver"
                className="btn-secondary"
                style={{ fontSize: "1rem", padding: "0.875rem 2.25rem" }}
              >
                Request Blood
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Feature checklist */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {["Free to use", "Verified donors", "Emergency STAT alerts", "Dhaka Cantonment area"].map((f) => (
                <span key={f} className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-muted)" }}>
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--success)" }} aria-hidden="true" />
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Strip ────────────────────────────────────────── */}
      <section
        style={{
          background: "rgba(13, 20, 36, 0.6)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div className="container mx-auto">
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

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="section">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center" style={{ marginBottom: "3.5rem" }}>
            <div className="badge badge-red" style={{ marginBottom: "1rem" }}>Simple Process</div>
            <h2>How Cantt-Blood Works</h2>
            <p style={{ maxWidth: 480, margin: "1rem auto 0" }}>
              Three simple steps stand between a donor and saving a life.
            </p>
          </div>

          <div className="grid-3">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} className="glass glass-hover card-glow" style={{ padding: "2rem", position: "relative" }}>
                {/* Step number watermark */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    right: "1.25rem",
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    color: "rgba(230,57,70,0.08)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </div>
                <div className="icon-box icon-box-red">
                  <Icon className="w-6 h-6" style={{ color: "var(--primary-light)" }} aria-hidden="true" />
                </div>
                <h3 style={{ marginBottom: "0.75rem" }}>{title}</h3>
                <p className="text-sm" style={{ lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <Link href="/how-it-works" className="btn-secondary">
              Learn More <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Blood Compatibility Teaser ──────────────────────────── */}
      <section className="section" style={{ background: "rgba(13, 20, 36, 0.5)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center" style={{ marginBottom: "3rem" }}>
            <div className="badge badge-red" style={{ marginBottom: "1rem" }}>Compatibility</div>
            <h2>Which Blood Groups Are Compatible?</h2>
            <p style={{ maxWidth: 500, margin: "1rem auto 0" }}>
              Our matching engine uses the complete ABO + RhD compatibility matrix.
            </p>
          </div>

          <div className="glass" style={{ overflowX: "auto", padding: "1.5rem" }}>
            <table className="table-auto" style={{ minWidth: 560 }}>
              <thead>
                <tr>
                  <th>Recipient</th>
                  <th>Compatible Donor Blood Groups</th>
                </tr>
              </thead>
              <tbody>
                {(Object.entries(COMPATIBLE_DONORS) as [string, string[]][]).map(([recipient, donors]) => (
                  <tr key={recipient}>
                    <td>
                      <span className="badge badge-red">{recipient}</span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {donors.map((d) => (
                          <span key={d} className="badge badge-gray" style={{ fontSize: "0.72rem" }}>
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Link href="/blood-types" className="btn-secondary">
              View Full Chart <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container-sm mx-auto px-4 md:px-6">
          <div className="text-center" style={{ marginBottom: "3rem" }}>
            <div className="badge badge-red" style={{ marginBottom: "1rem" }}>FAQ</div>
            <h2>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {FAQS.map(({ q, a }) => (
              <details key={q} className="glass" style={{ padding: "1.5rem" }}>
                <summary
                  style={{
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "var(--text)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  {q}
                  <ChevronRight className="faq-chevron w-4 h-4" style={{ color: "var(--text-muted)" }} aria-hidden="true" />
                </summary>
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {a === "CONTACT_LINK" ? (
                    <>
                      Cantt-Blood is built and maintained by Abu Horaira. You can get in touch{" "}
                      <a
                        href="https://portfolio-abu-horaira.vercel.app/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--info)", textDecoration: "underline" }}
                      >
                        here
                      </a>
                      .
                    </>
                  ) : a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────── */}
      <section
        className="section"
        style={{
          background: "linear-gradient(135deg, rgba(230,57,70,0.12), rgba(193,18,31,0.06))",
          borderTop: "1px solid rgba(230,57,70,0.14)",
        }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(230,57,70,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <Heart className="w-8 h-8 text-red-500 fill-red-500 animate-pulse-blood" aria-hidden="true" />
          </div>
          <h2 style={{ marginBottom: "1rem" }}>Ready to Save a Life?</h2>
          <p style={{ maxWidth: 460, margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
            It only takes 10 minutes to donate. Your blood could save up to 3 lives.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?role=donor" className="btn-primary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
              <Heart className="w-5 h-5" aria-hidden="true" />
              Register as Donor
            </Link>
            <Link href="/find-donor" className="btn-secondary" style={{ fontSize: "1rem", padding: "0.875rem 2.5rem" }}>
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Find Donors Near Me
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
