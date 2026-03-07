"use client";
import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle, XCircle } from "lucide-react";

interface PendingUser {
    _id: string;
    name: string;
    email: string;
    nidUrl: string;
    createdAt: string;
}

export default function NIDQueue() {
    const [queue, setQueue] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQueue();
    }, []);

    async function fetchQueue() {
        try {
            const res = await fetch("/api/nid/queue");
            const json = await res.json();
            if (json.success) setQueue(json.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleReview(userId: string, action: "approved" | "rejected") {
        try {
            const res = await fetch("/api/nid/approve", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action })
            });
            const json = await res.json();
            if (json.success) {
                // Remove from local queue
                setQueue(q => q.filter(u => u._id !== userId));
            } else {
                alert("Error: " + json.error);
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        }
    }

    return (
        <div>
            <div className="mb-8 border-b border-white/10 pb-6">
                <h1 className="text-2xl font-bold mb-2">NID Verification Queue</h1>
                <p className="text-gray-400">Review pending national ID submissions to verify real identities.</p>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading queue...</div>
            ) : queue.length === 0 ? (
                <div className="glass p-12 text-center text-gray-400">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-30 text-green-400" />
                    <h3 className="text-lg font-bold text-white mb-2">All Caught Up!</h3>
                    <p>There are no pending NID verification requests in the queue.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {queue.map(user => (
                        <div key={user._id} className="glass p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div>
                                <h3 className="font-bold text-lg mb-1">{user.name}</h3>
                                <p className="text-sm text-gray-400 mb-1">{user.email}</p>
                                <p className="text-xs text-gray-500">Submitted: {new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>

                            {user.nidUrl ? (
                                <div className="hidden md:block">
                                    <a href={user.nidUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded px-4 py-2 bg-blue-400/10 transition-colors">
                                        View NID Document
                                    </a>
                                </div>
                            ) : (
                                <div className="text-sm text-yellow-500 bg-yellow-500/10 px-3 py-1 rounded">No NID URL Found</div>
                            )}

                            <div className="flex gap-3 w-full md:w-auto">
                                <button
                                    onClick={() => handleReview(user._id, "approved")}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 px-4 py-2 rounded transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" /> Approve
                                </button>
                                <button
                                    onClick={() => handleReview(user._id, "rejected")}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 px-4 py-2 rounded transition-colors"
                                >
                                    <XCircle className="w-4 h-4" /> Reject
                                </button>
                                {user.nidUrl && (
                                    <a href={user.nidUrl} target="_blank" rel="noopener noreferrer" className="md:hidden flex-1 flex items-center justify-center text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 rounded px-4 py-2 bg-blue-400/10 transition-colors text-center w-full">
                                        View NID
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
