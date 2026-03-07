import type { Metadata } from "next";
import Link from "next/link";
import { UserPlus, ShieldCheck, Droplets, Bell, HeartHandshake, ChevronRight, Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works — Cantt-Blood Blood Donation Platform",
  description:
    "Learn how Cantt-Blood connects blood donors with patients in Dhaka Cantonment. Simple steps: register & verify, get matched, and save lives. Fully automated with emergency STAT alerts.",
  alternates: { canonical: "/how-it-works" },
};

const DONOR_STEPS = [
  { icon: UserPlus,       title: "Create Your Profile",  desc: "Sign up with email, select 'Donor' role, set your blood group, age, weight, and answer a short medical questionnaire." },
  { icon: ShieldCheck,    title: "Verify Your Identity", desc: "Upload a clear photo of your national ID (NID). Our admin team reviews and approves within 24 hours." },
  { icon: Activity,       title: "Get Matched",          desc: "When a patient in your area needs your blood type, you'll receive an instant email notification and see it on your dashboard." },
  { icon: HeartHandshake, title: "Donate & Save Lives",  desc: "Go to the specified hospital or blood bank, donate, and your Cantt-Blood profile logs the contribution automatically." },
];

const RECEIVER_STEPS = [
  { icon: UserPlus,       title: "Register as Receiver", desc: "Sign up, select 'Receiver' role, and complete NID verification to unlock the blood request form." },
  { icon: Droplets,       title: "Submit a Request",     desc: "Fill in patient details, blood group, urgency level (Routine / Urgent / STAT), hospital name, and units needed." },
  { icon: Bell,           title: "Track in Real-Time",   desc: "Watch your request status move through Pending → Approved → In-Transit → Fulfilled in your dashboard." },
  { icon: HeartHandshake, title: "Receive Blood",        desc: "Once approved, matched donors are contacted and inventory is checked. You receive updates at every step." },
];

export default function HowItWorksPage() {
  return (
    <div
      style={{
        background:
          "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(230,57,70,0.12), transparent)",
      }}
    >
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="badge badge-red" style={{ marginBottom: "1rem" }}>The Process</div>
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>How Cantt-Blood Works</h1>
          <p style={{ maxWidth: 520, margin: "1.25rem auto 0", fontSize: "1.05rem", lineHeight: 1.75 }}>
            We&apos;ve simplified blood donation into a few steps — for both donors and patients.
          </p>
        </div>
      </section>

      {/* ── Donor Journey ───────────────────────────────────── */}
      <section className="section">
        <div className="container mx-auto px-4 md:px-6">
          <div style={{ marginBottom: "2.5rem" }}>
            <h2>
              For <span className="gradient-text">Donors</span>
            </h2>
            <p style={{ marginTop: "0.75rem", maxWidth: 540 }}>
              Four simple steps to become a verified donor and start saving lives.
            </p>
          </div>

          <div className="grid-4">
            {DONOR_STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="glass glass-hover card-glow"
                style={{ padding: "1.75rem", position: "relative" }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    right: "1.25rem",
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    color: "rgba(230,57,70,0.08)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </div>
                <div className="icon-box icon-box-red">
                  <Icon className="w-5 h-5" style={{ color: "var(--primary-light)" }} aria-hidden="true" />
                </div>
                <h3 style={{ marginBottom: "0.625rem" }}>{title}</h3>
                <p className="text-sm" style={{ lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Link href="/register?role=donor" className="btn-primary">
              Register as Donor
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Receiver Journey ────────────────────────────────── */}
      <section className="section" style={{ background: "rgba(13, 20, 36, 0.5)" }}>
        <div className="container mx-auto px-4 md:px-6">
          <div style={{ marginBottom: "2.5rem" }}>
            <h2>
              For <span className="gradient-text">Patients &amp; Hospitals</span>
            </h2>
            <p style={{ marginTop: "0.75rem", maxWidth: 540 }}>
              Request blood quickly and track every step until fulfillment.
            </p>
          </div>

          <div className="grid-4">
            {RECEIVER_STEPS.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="glass glass-hover"
                style={{ padding: "1.75rem", position: "relative" }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    top: "1.25rem",
                    right: "1.25rem",
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    color: "rgba(59,130,246,0.08)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {i + 1}
                </div>
                <div className="icon-box icon-box-blue">
                  <Icon className="w-5 h-5" style={{ color: "var(--info)" }} aria-hidden="true" />
                </div>
                <h3 style={{ marginBottom: "0.625rem" }}>{title}</h3>
                <p className="text-sm" style={{ lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "2rem" }}>
            <Link href="/register?role=receiver" className="btn-secondary">
              Request Blood
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
