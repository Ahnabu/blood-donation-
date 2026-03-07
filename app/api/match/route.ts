import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import DonorProfile from "@/models/DonorProfile";
import { getCompatibleDonorGroups } from "@/lib/matching";
import type { BloodGroup } from "@/models/DonorProfile";
import { apiError, apiSuccess } from "@/lib/utils";

// POST /api/match — find compatible donors for a blood request
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return apiError("Unauthorized", 401);

        const body = await req.json();
        const { bloodGroup, coordinates, radiusKm = 50 } = body as {
            bloodGroup: BloodGroup;
            coordinates: [number, number];
            radiusKm?: number;
        };

        if (!bloodGroup || !coordinates) {
            return apiError("bloodGroup and coordinates are required", 400);
        }

        const compatibleGroups = getCompatibleDonorGroups(bloodGroup);
        await dbConnect();

        const now = new Date();

        const donors = await DonorProfile.find({
            bloodGroup: { $in: compatibleGroups },
            isAvailable: true,
            $or: [
                { nextEligibleDate: { $lte: now } },
                { nextEligibleDate: { $exists: false } },
                { lastDonated: { $exists: false } },
            ],
            location: {
                $near: {
                    $geometry: { type: "Point", coordinates },
                    $maxDistance: radiusKm * 1000, // metres
                },
            },
        })
            .limit(20)
            .populate("userId", "name phone email")
            .sort({ reliabilityScore: -1 })
            .lean();

        return apiSuccess({ donors, count: donors.length, compatibleGroups });
    } catch (err) {
        console.error("[POST /api/match]", err);
        return apiError("Internal server error", 500);
    }
}
