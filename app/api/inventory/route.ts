import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import BloodInventory from "@/models/BloodInventory";
import { inventorySchema } from "@/lib/validations";
import { apiError, apiSuccess } from "@/lib/utils";

export const dynamic = "force-dynamic";

// GET /api/inventory — public: stock summary; admin: full list
export async function GET() {
    try {
        await dbConnect();

        const now = new Date();
        // Mark expired units
        await BloodInventory.updateMany(
            { expiresAt: { $lt: now }, isExpired: false },
            { $set: { isExpired: true } }
        );

        const inventory = await BloodInventory.find({ isExpired: false })
            .sort({ bloodGroup: 1, expiresAt: 1 })
            .lean();

        // Aggregate totals by blood group for the public stock overview
        const summary = inventory.reduce(
            (acc, item) => {
                if (!acc[item.bloodGroup]) acc[item.bloodGroup] = 0;
                acc[item.bloodGroup] += item.units;
                return acc;
            },
            {} as Record<string, number>
        );

        return apiSuccess({ inventory, summary });
    } catch (err) {
        console.error("[GET /api/inventory]", err);
        return apiError("Internal server error", 500);
    }
}

// POST /api/inventory — admin only
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return apiError("Unauthorized", 401);
        // @ts-expect-error custom session fields
        if (session.user.role !== "admin") return apiError("Forbidden", 403);

        const body = await req.json();
        const parsed = inventorySchema.safeParse(body);
        if (!parsed.success) return apiError(parsed.error.errors[0].message, 400);

        await dbConnect();

        const item = await BloodInventory.create({
            ...parsed.data,
            // @ts-expect-error custom session fields
            managedBy: session.user.id,
        });

        return apiSuccess(item, 201);
    } catch (err) {
        console.error("[POST /api/inventory]", err);
        return apiError("Internal server error", 500);
    }
}
