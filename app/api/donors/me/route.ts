import { NextRequest, NextResponse } from "next/server";
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

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions) as any;
        if (!session?.user?.id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const { age, weight, area, lastDonated, isAvailable, medicalHistory } = body;

        await connectDB();

        const update: Record<string, unknown> = {};
        if (age !== undefined)          update.age          = Number(age);
        if (weight !== undefined)       update.weight       = Number(weight);
        if (area !== undefined)         update.area         = area;
        if (isAvailable !== undefined)  update.isAvailable  = isAvailable;
        if (lastDonated !== undefined)  update.lastDonated  = lastDonated ? new Date(lastDonated) : null;

        if (medicalHistory) {
            update["medicalHistory.hasChronicCondition"]     = !!medicalHistory.hasChronicCondition;
            update["medicalHistory.chronicConditionDetails"] = medicalHistory.chronicConditionDetails ?? "";
            update["medicalHistory.recentTattoo"]            = !!medicalHistory.recentTattoo;
            update["medicalHistory.tattooDate"]              = medicalHistory.tattooDate ? new Date(medicalHistory.tattooDate) : null;
            update["medicalHistory.recentAntibiotics"]       = !!medicalHistory.recentAntibiotics;
            update["medicalHistory.antibioticEndDate"]       = medicalHistory.antibioticEndDate ? new Date(medicalHistory.antibioticEndDate) : null;
            update["medicalHistory.malariaExposure"]         = !!medicalHistory.malariaExposure;
            update["medicalHistory.malariaDate"]             = medicalHistory.malariaDate ? new Date(medicalHistory.malariaDate) : null;
            update["medicalHistory.isPregnant"]              = !!medicalHistory.isPregnant;
            update["medicalHistory.recentTransfusion"]       = !!medicalHistory.recentTransfusion;
            update["medicalHistory.transfusionDate"]         = medicalHistory.transfusionDate ? new Date(medicalHistory.transfusionDate) : null;
            update["medicalHistory.updatedAt"]               = new Date();
        }

        // Recalculate nextEligibleDate if lastDonated changed
        if (lastDonated) {
            const next = new Date(lastDonated);
            next.setDate(next.getDate() + 90);
            update.nextEligibleDate = next;
        }

        const profile = await DonorProfile.findOneAndUpdate(
            { userId: session.user.id },
            { $set: update },
            { new: true }
        );

        if (!profile) return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: profile });
    } catch (err: any) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
