import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Users, Droplets, ChevronRight, CheckCircle, ShieldCheck } from "lucide-react";
import { COMPATIBLE_DONORS } from "@/lib/matching";
import connectDB from "@/lib/db";
import User from "@/models/User";
import ReceiverRequest from "@/models/ReceiverRequest";
import DonorProfile from "@/models/DonorProfile";
import HeroCTA from "./components/HeroCTA";
import BottomCTA from "./components/BottomCTA";

export const metadata: Metadata = {
  title: "Droplet — Connect Blood Donors, Save Lives",
  description:
    "Dhaka Cantonment's fastest blood donor-receiver matching platform. Find compatible blood donors nearby in seconds. Register as a donor or request blood in emergencies.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Droplet — Connect Blood Donors, Save Lives",
    description: "Find compatible blood donors in seconds. Register as a donor or request blood.",
    url: "/",
  },
};



const STEPS = [
  {
    icon: Users,
    title: "Register & Choose Role",
    desc: "Sign up with your email, pick Donor or Receiver, and fill in your blood group, phone number, and date of birth.",
  },
  {
    icon: ShieldCheck,
    title: "Verify Your Identity",
    desc: "Upload your NID (or Birth Certificate if under 18). Our admin team reviews and approves your account within 24 hours.",
  },
  {
    icon: Droplets,
    title: "Match & Connect",
    desc: "Receivers submit blood requests and instantly see verified donors who match their blood type. Donors appear automatically once approved.",
  },
  {
    icon: Heart,
    title: "Save a Life",
    desc: "Receivers contact matched donors directly. Donors log their donation, growing their reliability score and helping more people over time.",
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
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Droplet",
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

export default async function HomePage() {
  let donorCount = 0;
  let livesSaved = 0;
  let totalRequests = 0;
  let availableDonors = 0;
  try {
    await connectDB();
    const [donors, fulfilled, requests, available] = await Promise.all([
      User.countDocuments({ role: "donor" }),
      ReceiverRequest.countDocuments({ status: "Fulfilled" }),
      ReceiverRequest.countDocuments({}),
      DonorProfile.countDocuments({ isAvailable: true }),
    ]);
    donorCount = donors;
    livesSaved = fulfilled;
    totalRequests = requests;
    availableDonors = available;
  } catch {
    // fall back to zeroes if DB is unreachable
  }

  const STATS = [
    { value: `${donorCount.toLocaleString()}+`,    label: "Registered Donors" },
    { value: `${livesSaved.toLocaleString()}+`,    label: "Lives Saved" },
    { value: `${totalRequests.toLocaleString()}+`, label: "Total Requests" },
    { value: `${availableDonors.toLocaleString()}+`, label: "Available Now" },
  ];
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
        {/* Dark base overlay for mobile readability — starts below navbar (68px) */}
        <div
          aria-hidden="true"
          className="lg:hidden"
          style={{
            position: "absolute",
            top: 68, left: 0, right: 0, bottom: 0,
            background: "rgba(6,8,16,0.55)",
            pointerEvents: "none",
          }}
        />
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
            pointerEvents: "none",
          }}
        />

        {/* Floating blood drop (lg+) */}
        <div
          className="hidden lg:block animate-float blood-drop-glow"
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "6%",
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          {/* Blurred glow halo — scoped to the blood drop only */}
          <div aria-hidden="true" style={{
            position: "absolute",
            inset: "-40px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse 70% 70% at 50% 55%, rgba(230,57,70,0.45) 0%, transparent 70%)",
            filter: "blur(32px)",
            pointerEvents: "none",
          }} />
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

        <div className="container mx-auto relative" style={{ padding: "4rem clamp(1.5rem, 5vw, 3rem)" }}>
          <div className="animate-fade-in-up" style={{ maxWidth: 720 }}>
            {/* Readability backdrop — visible on mobile only */}
            <div
              aria-hidden="true"
              className="lg:hidden"
              style={{
                position: "absolute",
                inset: "-2rem -1.5rem",
                background: "radial-gradient(ellipse 100% 90% at 50% 50%, rgba(8,10,18,0.72) 30%, transparent 100%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
            {/* Eyebrow label */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <span style={{ display: "inline-block", width: 28, height: 2, borderRadius: 2, background: "var(--primary)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "var(--primary-light)" }}>
                Dhaka Cantonment&apos;s Blood Matching Platform
              </span>
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
              scheduled surgery or an emergency, Droplet bridges the gap between
              donors and patients instantly within the Cantonment area.
            </p>

            {/* CTA buttons */}
            <HeroCTA />

            {/* Feature checklist */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 2rem" }}>
              {["Free to use", "Verified donors", "Emergency STAT alerts", "Dhaka Cantonment area"].map((f) => (
                <span key={f} style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  <CheckCircle style={{ width: 16, height: 16, flexShrink: 0, color: "var(--success)" }} aria-hidden="true" />
                  {f}
                </span>
              ))}
            </div>
            </div>{/* end z-1 wrapper */}
          </div>
        </div>
      </section>


      {/* ── Stats Strip ────────────────────────────────────────── */}
      <section
        style={{
          background: "rgba(13, 20, 36, 0.6)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "2.5rem clamp(0.875rem, 4vw, 1.5rem)",
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

      {/* ── Motivating Quotes ──────────────────────────────────── */}
      <section className="section" style={{ background: "rgba(13, 20, 36, 0.4)", overflow: "hidden" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center" style={{ marginBottom: "3rem" }}>
            <div className="badge badge-red" style={{ marginBottom: "1rem" }}>Inspiration</div>
            <h2>Every Drop Counts</h2>
            <p style={{ maxWidth: 460, margin: "1rem auto 0", textAlign: "center", color: "var(--text-muted)" }}>
              One donation can save up to three lives. Be the reason someone goes home today.
            </p>
          </div>

          <div className="grid-3">
            {[
              {
                quote: "The blood you donate gives someone else another chance at life — one day that someone may be a close relative, a friend, or even you.",
                author: "World Health Organization",
                icon: "🩸",
              },
              {
                quote: "Donating blood is the most precious gift you can give another person — the gift of life. There's no substitute for human blood.",
                author: "American Red Cross",
                icon: "❤️",
              },
              {
                quote: "You have two hands — one to help yourself and one to help others. Give blood today and reach out with both.",
                author: "Unknown",
                icon: "🤝",
              },
              {
                quote: "It takes only a few minutes of your time to donate blood, but it can mean a lifetime for the person who receives it.",
                author: "Bangladesh Red Crescent",
                icon: "⏱️",
              },
              {
                quote: "Be a hero without a cape — roll up your sleeve and donate blood. Your one act of kindness can save three lives.",
                author: "Droplet",
                icon: "🦸",
              },
              {
                quote: "Blood cannot be manufactured. It can only come from generous donors like you. Your gift of life cannot be replaced by any other means.",
                author: "National Blood Service",
                icon: "💫",
              },
            ].map(({ quote, author, icon }) => (
              <div key={author} className="glass glass-hover" style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ fontSize: "1.75rem", lineHeight: 1 }}>{icon}</div>
                <p style={{ fontStyle: "italic", color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.75, flex: 1 }}>
                  &ldquo;{quote}&rdquo;
                </p>
                <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--primary-light)", letterSpacing: "0.05em" }}>
                  — {author}
                </p>
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
            <h2>How Droplet Works</h2>
            <p style={{ maxWidth: 480, margin: "1rem auto 0", textAlign: "center" }}>
              Four simple steps — from sign-up to saving a life.
            </p>
          </div>

          <div className="grid-4">
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
            <p style={{ maxWidth: 500, margin: "1rem auto 0", textAlign: "center" }}>
              Our matching engine uses the complete ABO + RhD compatibility matrix.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {(Object.entries(COMPATIBLE_DONORS) as [string, string[]][]).map(([recipient, donors]) => (
              <div key={recipient} className="glass" style={{ padding: "0.875rem 1.25rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem" }}>
                <span className="badge badge-red" style={{ flexShrink: 0, minWidth: 44, textAlign: "center" }}>{recipient}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", flex: 1 }}>
                  {donors.map((d) => (
                    <span key={d} className="badge badge-gray" style={{ fontSize: "0.72rem" }}>
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            ))}
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
                      Droplet is built and maintained by Abu Horaira. You can get in touch{" "}
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

      {/* ── Team ───────────────────────────────────────────────── */}
      <section className="section" style={{ background: "rgba(13, 20, 36, 0.5)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center" style={{ marginBottom: "3rem" }}>
            <div className="badge badge-red" style={{ marginBottom: "1rem" }}>The Team</div>
            <h2>People Behind Droplet</h2>
            <p style={{ maxWidth: 460, margin: "1rem auto 0", textAlign: "center", color: "var(--text-muted)" }}>
              Contact us for any information or suggestions.
            </p>
          </div>

          <div className="grid-3">
            {/* Nazmul */}
            <div className="glass glass-hover" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(230,57,70,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700, color: "var(--primary-light)" }}>N</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", marginBottom: "0.25rem" }}>Nazmul</p>
                <span className="badge badge-red" style={{ fontSize: "0.7rem" }}>Management</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.25rem" }}>
                <a href="tel:+8801756211322" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.45 19.45 0 0 1-6-6A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  01756-211322
                </a>
                <p style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>Manikdi, Dhaka Cantonment, Dhaka 1206</p>
              </div>
            </div>

            {/* Abu Horaira */}
            <div className="glass glass-hover card-glow" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(230,57,70,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700, color: "var(--primary-light)" }}>A</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", marginBottom: "0.25rem" }}>Abu Horaira</p>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  <a href="https://portfolio-abu-horaira.vercel.app/" target="_blank" rel="noopener noreferrer" className="badge badge-red" style={{ fontSize: "0.7rem", textDecoration: "none" }}>Developer ↗</a>
                  <span className="badge badge-red" style={{ fontSize: "0.7rem" }}>Management</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.25rem" }}>
                <a href="tel:+8801302537209" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.45 19.45 0 0 1-6-6A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  01302537209
                </a>
                <p style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>Manikdi, Dhaka Cantonment, Dhaka 1206</p>
              </div>
            </div>

            {/* Sojib */}
            <div className="glass glass-hover" style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(230,57,70,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.25rem", fontWeight: 700, color: "var(--primary-light)" }}>S</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", marginBottom: "0.25rem" }}>Sojib</p>
                <span className="badge badge-red" style={{ fontSize: "0.7rem" }}>Management</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem", marginTop: "0.25rem" }}>
                <a href="tel:+8801686956992" style={{ color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.45 19.45 0 0 1-6-6A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.07 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  01686-956992
                </a>
                <p style={{ color: "var(--text-faint)", fontSize: "0.8rem" }}>Manikdi, Dhaka Cantonment, Dhaka 1206</p>
              </div>
            </div>
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
          <p style={{ maxWidth: 460, margin: "0 auto 2.5rem", lineHeight: 1.7, textAlign: "center" }}>
            It only takes 10 minutes to donate. Your blood could save up to 3 lives.
          </p>
          <BottomCTA />
        </div>
      </section>
    </>
  );
}
