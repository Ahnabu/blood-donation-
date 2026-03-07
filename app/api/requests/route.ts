import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReceiverRequest from "@/models/ReceiverRequest";
import { bloodRequestSchema } from "@/lib/validations";
import { apiError, apiSuccess } from "@/lib/utils";

// GET /api/requests — list requests (admin sees all; receiver sees own)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return apiError("Unauthorized", 401);

        await dbConnect();

        const { searchParams } = req.nextUrl;
        const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
        const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20"));
        const urgency = searchParams.get("urgency");
        const status = searchParams.get("status");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {};

        // @ts-expect-error custom session fields
        if (session.user.role === "receiver") {
            // @ts-expect-error custom session fields
            query.receiverId = session.user.id;
        }
        if (urgency) query.urgency = urgency;
        if (status) query.status = status;

        const [requests, total] = await Promise.all([
            ReceiverRequest.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            ReceiverRequest.countDocuments(query),
        ]);

        return apiSuccess({ requests, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error("[GET /api/requests]", err);
        return apiError("Internal server error", 500);
    }
}

// POST /api/requests — create a new blood request
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return apiError("Unauthorized", 401);
        // @ts-expect-error custom session fields
        if (session.user.role !== "receiver") return apiError("Forbidden", 403);
        // @ts-expect-error custom session fields
        if (!session.user.verified) return apiError("NID verification required", 403);

        const body = await req.json();
        const parsed = bloodRequestSchema.safeParse(body);
        if (!parsed.success) {
            return apiError(parsed.error.errors[0].message, 400);
        }

        await dbConnect();

        const request = await ReceiverRequest.create({
            // @ts-expect-error custom session fields
            receiverId: session.user.id,
            ...parsed.data,
        });

        if (parsed.data.urgency === "STAT") {
            try {
                // Background task to send emails
                const { getCompatibleDonorGroups } = await import("@/lib/matching");
                const { sendMatchNotification } = await import("@/lib/email");
                const DonorProfile = (await import("@/models/DonorProfile")).default;

                const compatibleGroups = getCompatibleDonorGroups(parsed.data.bloodGroup as any);
                const profiles = await DonorProfile.find({ bloodGroup: { $in: compatibleGroups }, isAvailable: true }).populate("userId", "email");

                for (const profile of profiles) {
                    const profileUser = profile.userId as any;
                    if (profileUser?.email) {
                        await sendMatchNotification(profileUser.email, {
                            bloodGroup: parsed.data.bloodGroup,
                            hospitalName: parsed.data.hospitalName,
                            urgency: "STAT",
                            patientName: parsed.data.patientName
                        });
                    }
                }
            } catch (err) {
                console.error("Match Engine Error:", err);
            }
        }

        return apiSuccess(request, 201);
    } catch (err) {
        console.error("[POST /api/requests]", err);
        return apiError("Internal server error", 500);
    }
}
