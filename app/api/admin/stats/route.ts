import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import ReceiverRequest from "@/models/ReceiverRequest";
import BloodInventory from "@/models/BloodInventory";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Mark expired inventory
        await BloodInventory.updateMany(
            { expiresAt: { $lt: now }, isExpired: false },
            { $set: { isExpired: true } }
        );

        const [
            donors,
            donorsThisWeek,
            requests,
            statRequests,
            inventoryAgg,
            inventoryByGroup,
            pendingNid,
            recentRequests,
            newUsersThisMonth,
            fulfilledRequests,
        ] = await Promise.all([
            User.countDocuments({ role: "donor" }),
            User.countDocuments({ role: "donor", createdAt: { $gte: weekAgo } }),
            ReceiverRequest.countDocuments({ status: { $in: ["Pending", "Approved"] } }),
            ReceiverRequest.countDocuments({ urgency: "STAT", status: { $in: ["Pending", "Approved"] } }),
            BloodInventory.aggregate([
                { $match: { isExpired: false } },
                { $group: { _id: null, total: { $sum: "$units" } } }
            ]),
            BloodInventory.aggregate([
                { $match: { isExpired: false } },
                { $group: { _id: "$bloodGroup", units: { $sum: "$units" } } },
                { $sort: { _id: 1 } }
            ]),
            User.countDocuments({ nidStatus: "pending" }),
            ReceiverRequest.find({ status: { $in: ["Pending", "Approved"] } })
                .sort({ createdAt: -1 })
                .limit(5)
                .select("patientName bloodGroup urgency status hospitalName createdAt")
                .lean(),
            User.countDocuments({ createdAt: { $gte: monthAgo } }),
            ReceiverRequest.countDocuments({ status: "Fulfilled" }),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                donors,
                donorsThisWeek,
                requests,
                statRequests,
                inventory: inventoryAgg[0]?.total || 0,
                inventoryByGroup: Object.fromEntries(
                    inventoryByGroup.map((g: { _id: string; units: number }) => [g._id, g.units])
                ),
                pendingNid,
                recentRequests,
                newUsersThisMonth,
                fulfilledRequests,
            }
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
