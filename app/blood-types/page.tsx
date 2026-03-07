import type { Metadata } from "next";
import { COMPATIBLE_DONORS } from "@/lib/matching";

export const metadata: Metadata = {
  title: "Blood Type Compatibility Chart — Which Donors Can You Accept?",
  description:
    "Complete ABO and RhD blood type compatibility chart. Find out which blood groups can donate to which recipients. Used by Cantt-Blood's intelligent matching engine.",
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
  { group: "O-",  nickname: "Universal Donor",    desc: "Can donate red cells to all blood types. Only ~6% of people have this type.", prevalence: "6%" },
  { group: "O+",  nickname: "Most Common",         desc: "Most common blood type. Can donate to all Rh-positive recipients.",           prevalence: "37%" },
  { group: "A+",  nickname: "Very Common",         desc: "Second most common type. Can receive from A or O donors.",                    prevalence: "36%" },
  { group: "B+",  nickname: "Uncommon",            desc: "Can donate to B+ and AB+ recipients.",                                        prevalence: "9%" },
  { group: "AB+", nickname: "Universal Recipient", desc: "Can receive blood from all types. Rarest compatible recipient pool.",         prevalence: "3%" },
  { group: "A-",  nickname: "Rare",                desc: "Critical for Rh-negative patients. Very valuable donation.",                  prevalence: "6%" },
  { group: "B-",  nickname: "Very Rare",           desc: "Only 2% population. Important for B-type neonates.",                         prevalence: "2%" },
  { group: "AB-", nickname: "Rarest",              desc: "Rarest blood type (<1%). Universal plasma donor.",                           prevalence: "<1%" },
];

const ALL_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodTypesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        style={{
          background:
            "radial-gradient(ellipse 80% 40% at 50% -5%, rgba(230,57,70,0.12), transparent)",
        }}
      >
        {/* ── Hero ────────────────────────────────────────────── */}
        <section className="section-sm">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <div className="badge badge-red" style={{ marginBottom: "1rem" }}>Medical Reference</div>
            <h1 style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}>Blood Type Compatibility Chart</h1>
            <p style={{ maxWidth: 560, margin: "1.25rem auto 0", fontSize: "1.05rem", lineHeight: 1.75 }}>
              Our matching engine uses this exact ABO + RhD matrix to find safe, compatible donors for every blood request.
            </p>
          </div>
        </section>

        {/* ── Full Compatibility Table ─────────────────────────── */}
        <section className="section">
          <div className="container mx-auto px-4 md:px-6">
            <h2 style={{ textAlign: "center", marginBottom: "2.5rem" }}>
              Donor–Recipient Compatibility Matrix
            </h2>
            <div className="glass" style={{ overflowX: "auto", padding: "1.5rem" }}>
              <table className="table-auto" style={{ minWidth: 600 }}>
                <thead>
                  <tr>
                    <th>Recipient Blood Group</th>
                    <th>✅ Compatible Donors (Red Cells)</th>
                    <th>❌ Incompatible</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.entries(COMPATIBLE_DONORS) as [string, string[]][]).map(
                    ([recipient, compatible]) => {
                      const incompatible = ALL_GROUPS.filter(
                        (g) => !compatible.includes(g as never)
                      );
                      return (
                        <tr key={recipient}>
                          <td>
                            <span className="badge badge-red" style={{ fontSize: "0.9rem" }}>
                              {recipient}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                              {compatible.map((g) => (
                                <span key={g} className="badge badge-green" style={{ fontSize: "0.7rem" }}>
                                  {g}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                              {incompatible.map((g) => (
                                <span
                                  key={g}
                                  className="badge badge-gray"
                                  style={{ fontSize: "0.7rem", opacity: 0.45 }}
                                >
                                  {g}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Blood Group Facts ────────────────────────────────── */}
        <section className="section" style={{ background: "rgba(13, 20, 36, 0.5)" }}>
          <div className="container mx-auto px-4 md:px-6">
            <h2 style={{ textAlign: "center", marginBottom: "2.5rem" }}>Blood Group Facts</h2>
            <div className="grid-auto">
              {BLOOD_INFO.map(({ group, nickname, desc, prevalence }) => (
                <div key={group} className="glass glass-hover" style={{ padding: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <span className="badge badge-red" style={{ fontSize: "0.9rem" }}>
                      {group}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
                      {prevalence} of population
                    </span>
                  </div>
                  <p
                    style={{
                      fontWeight: 600,
                      color: "var(--text)",
                      fontSize: "0.9375rem",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {nickname}
                  </p>
                  <p className="text-sm" style={{ lineHeight: 1.7 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
