import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { apiError, apiSuccess } from "@/lib/utils";

// GET /api/admin/users
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-expect-error custom fields
        if (!session || session.user?.role !== "admin") return apiError("Forbidden", 403);

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
        const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
        const role       = searchParams.get("role")       ?? "";
        const nidStatus  = searchParams.get("nidStatus")  ?? "";
        const bloodGroup = searchParams.get("bloodGroup") ?? "";
        const search     = searchParams.get("search")     ?? "";

        const query: Record<string, unknown> = {};
        if (role)       query.role       = role;
        if (nidStatus)  query.nidStatus  = nidStatus;
        if (bloodGroup) query.bloodGroup = bloodGroup;
        if (search) {
            query.$or = [
                { name:  { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const [users, total] = await Promise.all([
            User.find(query)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments(query),
        ]);

        return apiSuccess({ users, total, page, limit });
    } catch (err) {
        console.error("[GET /api/admin/users]", err);
        return apiError("Internal server error", 500);
    }
}
