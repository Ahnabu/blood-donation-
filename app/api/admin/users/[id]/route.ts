import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import DonorProfile from "@/models/DonorProfile";
import ReceiverRequest from "@/models/ReceiverRequest";
import { apiError, apiSuccess } from "@/lib/utils";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        // @ts-expect-error custom fields
        if (!session || session.user?.role !== "admin") return apiError("Forbidden", 403);

        const { id } = await params;
        await dbConnect();

        const user = await User.findById(id).select("-password").lean();
        if (!user) return apiError("User not found", 404);

        let donorProfile = null;
        let requestCount = 0;

        if (user.role === "donor") {
            donorProfile = await DonorProfile.findOne({ userId: id }).lean();
        } else if (user.role === "receiver") {
            requestCount = await ReceiverRequest.countDocuments({ requesterId: id });
        }

        return apiSuccess({ user, donorProfile, requestCount });
    } catch (err) {
        console.error("[GET /api/admin/users/[id]]", err);
        return apiError("Internal server error", 500);
    }
}
