import type { Metadata } from "next";
import { Suspense } from "react";
import FindDonorClient from "./FindDonorClient";

export const metadata: Metadata = {
    title: "Find a Blood Donor Near You — LifeLink",
    description:
        "Search for verified blood donors by blood group and district. Free, fast, and anonymous. Connect with O+, A+, B+, AB+ and all blood type donors across Bangladesh.",
    alternates: { canonical: "/find-donor" },
};

export default function FindDonorPage() {
    return (
        <div style={{ background: "radial-gradient(ellipse 70% 30% at 50% 0%, rgba(220,38,38,0.1), transparent)" }}>
            <section className="section-sm">
                <div className="container mx-auto px-6 text-center">
                    <div className="badge badge-red mb-4">Live Search</div>
                    <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Find a Blood Donor</h1>
                    <p className="text-gray-400 mt-4" style={{ maxWidth: 520, margin: "1rem auto 0" }}>
                        Search our database of verified donors by blood group and district. Contact details are shared only after admin-verified matching.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container mx-auto px-6">
                    <Suspense fallback={<div className="text-center text-gray-400 py-20">Loading donors...</div>}>
                        <FindDonorClient />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
