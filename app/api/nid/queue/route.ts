import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (session?.user?.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const pendingUsers = await User.find({ nidStatus: "pending" })
            .select("name email nidImage createdAt")
            .sort({ createdAt: 1 })
            .lean();

        return NextResponse.json({ success: true, data: pendingUsers });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
