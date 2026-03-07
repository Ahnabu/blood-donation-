"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Clock, Activity, Calendar, Droplets } from "lucide-react";
import { daysUntil } from "@/lib/utils";

export default function DonorDashboard() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app we'd fetch the donor profile here.
        // For MVP, simulating a fetch
        setTimeout(() => {
            setProfile({
                bloodGroup: "O+",
                totalDonations: 3,
                lastDonated: new Date("2024-01-15").toISOString(),
                nextEligibleDate: new Date("2024-04-15").toISOString(), // +3 months approx
            });
            setLoading(false);
        }, 500);
    }, []);

    if (loading) return <div className="text-center py-20 text-gray-500">Loading donor profile...</div>;

    const daysToEligible = daysUntil(profile.nextEligibleDate);
    const isEligible = daysToEligible === 0;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Donor Hub</h1>
                <p className="text-gray-400">Manage your profile, track your impact, and find donation requests.</p>
            </div>

            <div className="grid-3 mb-8">
                <div className="stat-card p-6">
                    <div className="flex items-center gap-3 mb-4 text-gray-400">
                        <Activity className="w-5 h-5" /> Eligibility
                    </div>
                    {isEligible ? (
                        <div>
                            <div className="text-2xl font-bold text-green-400 mb-1">Eligible to Donate</div>
                            <p className="text-sm text-gray-500">You can donate blood today.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="text-2xl font-bold text-yellow-400 mb-1">{daysToEligible} Days</div>
                            <p className="text-sm text-gray-500">until you can donate again.</p>
                        </div>
                    )}
                </div>

                <div className="stat-card p-6">
                    <div className="flex items-center gap-3 mb-4 text-gray-400">
                        <Droplets className="w-5 h-5 text-red-500" /> Blood Group
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{profile.bloodGroup}</div>
                    <p className="text-sm text-gray-500">Universal donor</p>
                </div>

                <div className="stat-card p-6">
                    <div className="flex items-center gap-3 mb-4 text-gray-400">
                        <Calendar className="w-5 h-5" /> Total Donations
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{profile.totalDonations}</div>
                    <p className="text-sm text-gray-500">Lives impacted: ~{profile.totalDonations * 3}</p>
                </div>
            </div>

            <div className="glass p-6">
                <h2 className="text-xl font-bold mb-4">Nearby Urgent Requests</h2>
                {isEligible ? (
                    <div className="text-center py-10 text-gray-400">
                        <p>No urgent requests for {profile.bloodGroup} in your area right now.</p>
                        <p className="text-sm mt-2">We will notify you immediately when there is a match.</p>
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">
                        <p>You are currently in your waiting period.</p>
                        <p className="text-sm mt-2">Requests will reappear here once you are eligible to donate again.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
