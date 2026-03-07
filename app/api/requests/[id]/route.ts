import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import ReceiverRequest from "@/models/ReceiverRequest";
import { apiError, apiSuccess } from "@/lib/utils";

// PATCH /api/requests/[id] — update status or admin notes
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return apiError("Unauthorized", 401);

        const { id } = await params;
        const body = await req.json();

        await dbConnect();

        const request = await ReceiverRequest.findById(id);
        if (!request) return apiError("Request not found", 404);

        // @ts-expect-error custom session fields
        const role = session.user.role;

        // Receiver can only cancel their own pending request
        if (role === "receiver") {
            // @ts-expect-error custom session fields
            if (request.receiverId.toString() !== session.user.id) {
                return apiError("Forbidden", 403);
            }
            if (body.status !== "Cancelled" || request.status !== "Pending") {
                return apiError("Only pending requests can be cancelled by receiver", 400);
            }
        }

        // Allowed status transitions by admin
        if (role === "admin") {
            if (body.status) request.status = body.status;
            if (body.adminNotes) request.adminNotes = body.adminNotes;
            if (body.matchedDonors) request.matchedDonors = body.matchedDonors;
        } else {
            if (body.status) request.status = body.status;
        }

        await request.save();
        return apiSuccess(request);
    } catch (err) {
        console.error("[PATCH /api/requests/:id]", err);
        return apiError("Internal server error", 500);
    }
}

// GET /api/requests/[id] — get single request detail
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return apiError("Unauthorized", 401);

        const { id } = await params;
        await dbConnect();

        const request = await ReceiverRequest.findById(id).populate("matchedDonors", "name phone");
        if (!request) return apiError("Request not found", 404);

        return apiSuccess(request);
    } catch (err) {
        console.error("[GET /api/requests/:id]", err);
        return apiError("Internal server error", 500);
    }
}
