"use client";
import { useState, useEffect } from "react";
import { Users, Droplets, AlertTriangle, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ donors: 0, requests: 0, inventory: 0, pendingNid: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating admin overview fetch
        setTimeout(() => {
            setStats({
                donors: 124,
                requests: 18,
                inventory: 245,
                pendingNid: 7,
            });
            setLoading(false);
        }, 500);
    }, []);

    return (
        <div>
            <div className="mb-8 border-b border-white/10 pb-6">
                <h1 className="text-2xl font-bold mb-2">Mission Control</h1>
                <p className="text-gray-400">Global overview of platform activity, inventory, and verifications.</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading metrics...</div>
            ) : (
                <>
                    <div className="grid-4 mb-8">
                        <div className="stat-card p-6 border-blue-500/20">
                            <div className="flex items-center gap-3 mb-4 text-blue-400">
                                <Users className="w-5 h-5" /> Total Donors
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stats.donors}</div>
                            <p className="text-xs text-gray-500">+12 this week</p>
                        </div>

                        <div className="stat-card p-6 border-yellow-500/20">
                            <div className="flex items-center gap-3 mb-4 text-yellow-400">
                                <AlertTriangle className="w-5 h-5" /> Active Requests
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stats.requests}</div>
                            <p className="text-xs text-gray-500">3 STAT emergencies</p>
                        </div>

                        <div className="stat-card p-6 border-red-500/20">
                            <div className="flex items-center gap-3 mb-4 text-red-500">
                                <Droplets className="w-5 h-5" /> Blood Units
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stats.inventory}</div>
                            <p className="text-xs text-gray-500">Safe operating levels</p>
                        </div>

                        <div className="stat-card p-6 border-purple-500/20">
                            <div className="flex items-center gap-3 mb-4 text-purple-400">
                                <ShieldCheck className="w-5 h-5" /> Pending NID
                            </div>
                            <div className="text-3xl font-bold text-white mb-1">{stats.pendingNid}</div>
                            <p className="text-xs text-gray-500">Requires review</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="glass p-6">
                            <h2 className="text-lg font-bold mb-4">Urgency Feed (Live)</h2>
                            <div className="text-center py-12 text-gray-500">
                                <ActivityIcon />
                                <p className="mt-2">Connecting to realtime feed...</p>
                            </div>
                        </div>

                        <div className="glass p-6">
                            <h2 className="text-lg font-bold mb-4">NID Verification Queue</h2>
                            <div className="text-center py-12 text-gray-500">
                                <ShieldCheck className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p>7 documents waiting for approval</p>
                                <button className="text-blue-400 text-sm mt-3 border border-blue-400/30 rounded px-4 py-1 hover:bg-blue-400/10 transition-colors">
                                    Review Queue
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function ActivityIcon() {
    return (
        <svg className="w-8 h-8 text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    );
}
