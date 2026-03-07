import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import DonorProfile from "@/models/DonorProfile";
import { apiError, apiSuccess } from "@/lib/utils";

// GET /api/donors — public donor search (anonymized)
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = req.nextUrl;
        const bloodGroup = searchParams.get("bloodGroup");
        const area = searchParams.get("area");
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
        const limit = Math.min(20, parseInt(searchParams.get("limit") ?? "12"));

        await dbConnect();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = { isAvailable: true };
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (area) query.area = { $regex: area, $options: "i" };

        const [donors, total] = await Promise.all([
            DonorProfile.find(query)
                .select("bloodGroup area totalDonations reliabilityScore")  // Anonymized
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            DonorProfile.countDocuments(query),
        ]);

        return apiSuccess({ donors, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error("[GET /api/donors]", err);
        return apiError("Internal server error", 500);
    }
}
