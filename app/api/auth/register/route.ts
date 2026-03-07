import { NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import DonorProfile from "@/models/DonorProfile";
import { registerSchema } from "@/lib/validations";
import { apiError, apiSuccess } from "@/lib/utils";

// POST /api/auth/register
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return apiError(parsed.error.errors[0].message, 400);
        }

        await dbConnect();

        const { name, email, password, role, phone } = parsed.data;

        const existing = await User.findOne({ email });
        if (existing) return apiError("Email already registered", 409);

        const user = await User.create({ name, email, password, role, phone });

        // Seed empty donor profile if role is donor
        if (role === "donor") {
            await DonorProfile.create({
                userId: user._id,
                bloodGroup: "O+",          // placeholder; donor fills in profile
                location: { type: "Point", coordinates: [0, 0] },
                district: "",
                age: 18,
                weight: 50,
            });
        }

        return apiSuccess(
            { id: user._id.toString(), email: user.email, role: user.role },
            201
        );
    } catch (err) {
        console.error("[POST /api/auth/register]", err);
        return apiError("Internal server error", 500);
    }
}
