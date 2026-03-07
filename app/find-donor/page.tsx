import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import FindDonorClient from "./FindDonorClient";

export const metadata: Metadata = {
  title: "Find a Blood Donor Near You — Cantt-Blood",
  description:
    "Search for verified blood donors in Dhaka Cantonment. Free, fast, and anonymous. Connect with O+, A+, B+, AB+ donors.",
  alternates: { canonical: "/find-donor" },
};

export default function FindDonorPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingBottom: "5rem",
        background:
          "radial-gradient(ellipse 80% 35% at 50% -5%, rgba(230,57,70,0.1), transparent)",
      }}
    >
      <div className="container mx-auto px-4 md:px-6" style={{ paddingTop: "4rem" }}>
        <div style={{ marginBottom: "3rem" }}>
          <div className="badge badge-red" style={{ marginBottom: "1rem", fontSize: "0.78rem" }}>
            Dhaka Cantonment Area
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)", marginBottom: "1rem" }}>
            Find a <span className="gradient-text">Donor</span>
          </h1>
          <p style={{ maxWidth: 560, lineHeight: 1.75 }}>
            Search our database of verified donors in Dhaka Cantonment. Contact details
            are shared only after admin-verified matching.
          </p>
        </div>

        <Suspense
          fallback={
            <div
              style={{
                textAlign: "center",
                padding: "5rem 1rem",
                color: "var(--text-muted)",
              }}
            >
              <Loader2
                className="w-8 h-8 animate-spin mx-auto mb-3"
                style={{ color: "var(--primary)" }}
              />
              <p>Loading donors…</p>
            </div>
          }
        >
          <FindDonorClient />
        </Suspense>
      </div>
    </div>
  );
}
