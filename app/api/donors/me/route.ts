import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import DonorProfile from "@/models/DonorProfile";

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        if (!session?.user?.id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const profile = await DonorProfile.findOne({ userId: session.user.id });
        if (!profile) return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: profile });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
