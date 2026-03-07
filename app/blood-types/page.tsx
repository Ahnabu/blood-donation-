import type { Metadata } from "next";
import { COMPATIBLE_DONORS } from "@/lib/matching";

export const metadata: Metadata = {
    title: "Blood Type Compatibility Chart — Which Donors Can You Accept?",
    description:
        "Complete ABO and RhD blood type compatibility chart. Find out which blood groups can donate to which recipients. Used by LifeLink's intelligent matching engine.",
    alternates: { canonical: "/blood-types" },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "Blood Type Compatibility Chart",
    description: "ABO and RhD blood type compatibility reference for blood donation and transfusion.",
    medicalAudience: { "@type": "MedicalAudience", audienceType: "Patient" },
};

const BLOOD_INFO = [
    { group: "O-", nickname: "Universal Donor", desc: "Can donate red cells to all blood types. Only ~6% of people have this type.", prevalence: "6%" },
    { group: "O+", nickname: "Most Common", desc: "Most common blood type. Can donate to all Rh-positive recipients.", prevalence: "37%" },
    { group: "A+", nickname: "Very Common", desc: "Second most common type. Can receive from A or O donors.", prevalence: "36%" },
    { group: "B+", nickname: "Uncommon", desc: "Can donate to B+ and AB+ recipients.", prevalence: "9%" },
    { group: "AB+", nickname: "Universal Recipient", desc: "Can receive blood from all types. Rarest compatible recipient pool.", prevalence: "3%" },
    { group: "A-", nickname: "Rare", desc: "Critical for Rh-negative patients. Very valuable donation.", prevalence: "6%" },
    { group: "B-", nickname: "Very Rare", desc: "Only 2% population. Important for B-type neonates.", prevalence: "2%" },
    { group: "AB-", nickname: "Rarest", desc: "Rarest blood type (<1%). Universal plasma donor.", prevalence: "<1%" },
];

export default function BloodTypesPage() {
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

            <div style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(220,38,38,0.12), transparent)" }}>
                {/* Hero */}
                <section className="section-sm">
                    <div className="container mx-auto px-6 text-center">
                        <div className="badge badge-red mb-4">Medical Reference</div>
                        <h1 style={{ fontSize: "clamp(2rem,4vw,3rem)" }}>Blood Type Compatibility Chart</h1>
                        <p className="text-gray-400 mt-4" style={{ maxWidth: 560, margin: "1rem auto 0", fontSize: "1.1rem" }}>
                            Our matching engine uses this exact ABO + RhD matrix to find safe, compatible donors for every blood request.
                        </p>
                    </div>
                </section>

                {/* Full Compatibility Table */}
                <section className="section">
                    <div className="container mx-auto px-6">
                        <h2 className="text-center mb-10" style={{ fontSize: "1.75rem" }}>Donor-Recipient Compatibility Matrix</h2>
                        <div className="glass" style={{ overflowX: "auto", padding: "1.5rem" }}>
                            <table className="table-auto" style={{ minWidth: 640 }}>
                                <thead>
                                    <tr>
                                        <th>Recipient Blood Group</th>
                                        <th>✅ Compatible Donor Groups (Red Cells)</th>
                                        <th>❌ Incompatible</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(Object.entries(COMPATIBLE_DONORS) as [string, string[]][]).map(([recipient, compatible]) => {
                                        const all = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
                                        const incompatible = all.filter((g) => !compatible.includes(g as never));
                                        return (
                                            <tr key={recipient}>
                                                <td><span className="badge badge-red" style={{ fontSize: "1rem" }}>{recipient}</span></td>
                                                <td>
                                                    <div className="flex flex-wrap gap-2">
                                                        {compatible.map((g) => (
                                                            <span key={g} className="badge badge-green text-xs">{g}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="flex flex-wrap gap-2">
                                                        {incompatible.map((g) => (
                                                            <span key={g} className="badge badge-gray text-xs opacity-50">{g}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Blood Group Cards */}
                <section className="section" style={{ background: "rgba(17,24,39,0.4)" }}>
                    <div className="container mx-auto px-6">
                        <h2 className="text-center mb-10" style={{ fontSize: "1.75rem" }}>Blood Group Facts</h2>
                        <div className="grid-auto">
                            {BLOOD_INFO.map(({ group, nickname, desc, prevalence }) => (
                                <div key={group} className="glass" style={{ padding: "1.5rem" }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="badge badge-red" style={{ fontSize: "1.1rem" }}>{group}</span>
                                        <span className="text-xs text-gray-500">{prevalence} of population</span>
                                    </div>
                                    <div className="font-semibold text-white mb-2">{nickname}</div>
                                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
