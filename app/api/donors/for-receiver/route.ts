import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import DonorProfile from "@/models/DonorProfile";
import { apiError, apiSuccess } from "@/lib/utils";

// GET /api/donors/for-receiver?bloodGroup=A+
// Only accessible by verified (nidStatus=approved) receivers
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-expect-error custom fields
        const role        = session?.user?.role       as string | undefined;
        // @ts-expect-error custom fields
        const nidStatus   = session?.user?.nidStatus  as string | undefined;

        if (!session)                  return apiError("Unauthorized", 401);
        if (role !== "receiver")       return apiError("Forbidden — receivers only", 403);
        if (nidStatus !== "approved")  return apiError("Identity verification required", 403);

        await dbConnect();

        const { searchParams } = req.nextUrl;
        const bloodGroup = searchParams.get("bloodGroup") ?? "";
        const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
        const limit = Math.min(30, Math.max(1, Number(searchParams.get("limit") ?? 20)));

        const query: Record<string, unknown> = { isAvailable: true };
        if (bloodGroup) query.bloodGroup = bloodGroup;

        const [donors, total] = await Promise.all([
            DonorProfile.find(query)
                .populate<{ userId: { name: string; phone?: string } }>("userId", "name phone")
                .select("bloodGroup area lastDonated totalDonations reliabilityScore isAvailable userId")
                .sort({ reliabilityScore: -1, totalDonations: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            DonorProfile.countDocuments(query),
        ]);

        return apiSuccess({ donors, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error("[GET /api/donors/for-receiver]", err);
        return apiError("Internal server error", 500);
    }
}
