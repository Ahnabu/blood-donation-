import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { nidReviewSchema } from "@/lib/validations";
import { apiError, apiSuccess } from "@/lib/utils";

// PATCH /api/nid/approve — admin reviews NID submission
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return apiError("Unauthorized", 401);
        // @ts-expect-error custom session fields
        if (session.user.role !== "admin") return apiError("Forbidden", 403);

        const body = await req.json();
        const parsed = nidReviewSchema.safeParse(body);
        if (!parsed.success) return apiError(parsed.error.errors[0].message, 400);

        await dbConnect();

        const { userId, action } = parsed.data;

        const user = await User.findByIdAndUpdate(
            userId,
            {
                nidStatus: action,
                verified: action === "approved",
            },
            { new: true }
        ).select("-password");

        if (!user) return apiError("User not found", 404);

        return apiSuccess({ userId, nidStatus: user.nidStatus, verified: user.verified });
    } catch (err) {
        console.error("[PATCH /api/nid/approve]", err);
        return apiError("Internal server error", 500);
    }
}
