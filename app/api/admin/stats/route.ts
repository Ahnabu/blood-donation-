import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import ReceiverRequest from "@/models/ReceiverRequest";
import BloodInventory from "@/models/BloodInventory";

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const [donors, requests, inventory, pendingNid] = await Promise.all([
            User.countDocuments({ role: "donor" }),
            ReceiverRequest.countDocuments({ status: { $in: ["Pending", "Approved"] } }),
            BloodInventory.aggregate([{ $group: { _id: null, total: { $sum: "$units" } } }]),
            User.countDocuments({ nidStatus: "pending" })
        ]);

        return NextResponse.json({
            success: true,
            data: {
                donors,
                requests,
                inventory: inventory[0]?.total || 0,
                pendingNid
            }
        });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
