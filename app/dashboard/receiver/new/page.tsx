"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import dynamic from "next/dynamic";
import { bloodRequestSchema } from "@/lib/validations";

const LocationPicker = dynamic(() => import("@/components/maps/LocationMapPicker"), { ssr: false });

type FormData = z.infer<typeof bloodRequestSchema>;

export default function NewBloodRequest() {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formCoords, setFormCoords] = useState<[number, number] | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(bloodRequestSchema),
        defaultValues: {
            district: "Dhaka Cantonment",
            urgency: "Routine",
            unitsRequired: 1,
            // @ts-ignore Let's manually inject coordinates when sending
        }
    });

    const onSubmit = async (data: FormData) => {
        if (!formCoords) {
            setError("Please pinpoint the exact hospital location on the map.");
            return;
        }

        setSubmitting(true);
        setError("");

        const payload = {
            ...data,
            location: {
                type: "Point",
                coordinates: [formCoords[1], formCoords[0]] // GeoJSON expects [lng, lat]
            }
        };

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const json = await res.json();
            if (json.success) {
                router.push("/dashboard/receiver");
            } else {
                setError(json.error || "Failed to submit request.");
            }
        } catch (err) {
            console.error(err);
            setError("A network error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-10">
            <h1 className="text-2xl font-bold mb-2">Request Blood</h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>Fill out the details below so we can find compatible donors in Dhaka Cantonment.</p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="glass" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", padding: "1.75rem" }}>
                <div className="grid-2">
                    <div>
                        <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Patient Name</label>
                        <input
                            type="text"
                            {...register("patientName")}
                            className="input"
                            placeholder="John Doe"
                        />
                        {errors.patientName && <p className="text-red-400 text-xs mt-1">{errors.patientName.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Contact Phone</label>
                        <input
                            type="tel"
                            {...register("phone")}
                            className="input"
                            placeholder="01700000000"
                        />
                        {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
                    </div>
                </div>

                <div className="grid-2">
                    <div>
                        <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Blood Group</label>
                        <select {...register("bloodGroup")} className="input">
                            <option value="">Select Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                        {errors.bloodGroup && <p className="text-red-400 text-xs mt-1">{errors.bloodGroup.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Units Required</label>
                        <input
                            type="number"
                            {...register("unitsRequired", { valueAsNumber: true })}
                            className="input"
                            min="1"
                            max="10"
                        />
                        {errors.unitsRequired && <p className="text-red-400 text-xs mt-1">{errors.unitsRequired.message}</p>}
                    </div>
                </div>

                <div className="grid-2">
                    <div>
                        <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Urgency</label>
                        <select {...register("urgency")} className="input">
                            <option value="Routine">Routine (Within a week)</option>
                            <option value="Urgent">Urgent (Within 48 hours)</option>
                            <option value="STAT">STAT (Immediate emergency)</option>
                        </select>
                        {errors.urgency && <p className="text-red-400 text-xs mt-1">{errors.urgency.message}</p>}
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Hospital Name (Dhaka Cantonment)</label>
                    <input
                        type="text"
                        {...register("hospitalName")}
                        className="input"
                        placeholder="CMH Dhaka"
                    />
                    {errors.hospitalName && <p className="text-red-400 text-xs mt-1">{errors.hospitalName.message}</p>}
                </div>

                <div>
                    <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Exact Location (Pinpoint the Hospital)</label>
                    <div className="mb-2">
                        <LocationPicker
                            value={formCoords}
                            onChange={(coords) => setFormCoords(coords)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1.5" style={{ color: "var(--text-muted)" }}>Reason for Transfusion</label>
                    <textarea
                        {...register("reason")}
                        className="input min-h-25 resize-y"
                        placeholder="e.g. Surgery, Dengue, Accident"
                    />
                    {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason.message}</p>}
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center text-lg h-14">
                        {submitting ? "Submitting Request..." : "Submit Blood Request"}
                    </button>
                    <p className="text-xs text-center mt-3" style={{ color: "var(--text-faint)" }}>
                        By submitting, you agree to receive calls from potential donors.
                    </p>
                </div>
            </form>
        </div>
    );
}
