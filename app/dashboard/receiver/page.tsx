"use client";
import { useState, useEffect } from "react";
import { Plus, Activity, Clock, CheckCircle } from "lucide-react";
import { STATUS_STEPS, getStatusIndex, URGENCY_CONFIG } from "@/lib/utils";

export default function ReceiverDashboard() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRequests() {
            const res = await fetch("/api/requests");
            const json = await res.json();
            if (json.success) setRequests(json.data.requests);
            setLoading(false);
        }
        fetchRequests();
    }, []);

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">My Requests</h1>
                    <p className="text-gray-400">Track and manage your blood requests.</p>
                </div>
                <button className="btn-primary" onClick={() => alert("New Request Form Modal (TODO)")}>
                    <Plus className="w-4 h-4" /> New Request
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading requests...</div>
            ) : requests.length === 0 ? (
                <div className="glass p-12 text-center text-gray-400">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <h3 className="text-lg font-bold text-white mb-2">No active requests</h3>
                    <p className="mb-6">You haven't made any blood requests yet.</p>
                    <button className="btn-secondary" onClick={() => alert("New Request Form Modal (TODO)")}>
                        Request Blood Now
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {requests.map(req => {
                        const urgency = URGENCY_CONFIG[req.urgency as keyof typeof URGENCY_CONFIG];
                        const currentIndex = getStatusIndex(req.status);

                        return (
                            <div key={req._id} className="glass p-6 border-l-4" style={{ borderLeftColor: urgency.color.replace('text-', '') }}>
                                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="badge badge-red text-lg">{req.bloodGroup}</span>
                                            <span className={`badge ${urgency.bg} ${urgency.color} ${urgency.border}`}>
                                                {urgency.label}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-lg">{req.patientName}</h3>
                                        <p className="text-sm text-gray-400">{req.hospitalName}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">{req.unitsNeeded} <span className="text-sm font-normal text-gray-400">units</span></div>
                                        <div className="text-xs text-gray-500 mt-1">Needed by {new Date(req.neededBy).toLocaleDateString()}</div>
                                    </div>
                                </div>

                                {/* Status Tracker */}
                                <div className="py-4">
                                    <div className="status-track">
                                        {STATUS_STEPS.map((step, idx) => (
                                            <div key={step} className={`status-step ${idx < currentIndex ? "done" : idx === currentIndex ? "active" : ""}`}>
                                                <div className="step-dot flex items-center justify-center">
                                                    {idx < currentIndex && <CheckCircle className="w-3 h-3 text-white" />}
                                                </div>
                                                <span className={`text-xs mt-2 font-medium ${idx <= currentIndex ? "text-white" : "text-gray-500"}`}>
                                                    {step}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {req.status === "Pending" && (
                                    <div className="mt-6 flex justify-end">
                                        <button className="text-sm text-red-400 hover:text-red-300 transition-colors">Cancel Request</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
