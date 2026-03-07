import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { apiError, apiSuccess } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return apiError("Unauthorized", 401);

    await connectDB();
    const user = await User.findOne({ email: session.user.email }).select("-password -__v").lean();
    if (!user) return apiError("User not found", 404);

    return apiSuccess(user);
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return apiError("Unauthorized", 401);

    await connectDB();

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return apiError("Invalid JSON", 400);
    }

    const { name, phone, currentPassword, newPassword } = body as {
        name?: string;
        phone?: string;
        currentPassword?: string;
        newPassword?: string;
    };

    const user = await User.findOne({ email: session.user.email }).select("+password");
    if (!user) return apiError("User not found", 404);

    const updates: Record<string, unknown> = {};

    if (name !== undefined) {
        const trimmed = String(name).trim();
        if (trimmed.length < 2) return apiError("Name must be at least 2 characters", 400);
        updates.name = trimmed;
    }

    if (phone !== undefined) {
        const trimmed = String(phone).trim();
        if (trimmed && !/^\+?[0-9]{7,15}$/.test(trimmed)) return apiError("Invalid phone number", 400);
        updates.phone = trimmed;
    }

    if (newPassword !== undefined) {
        if (!currentPassword) return apiError("Current password is required", 400);
        const valid = await bcrypt.compare(String(currentPassword), user.password as string);
        if (!valid) return apiError("Current password is incorrect", 400);
        if (String(newPassword).length < 8) return apiError("New password must be at least 8 characters", 400);
        // Bypass pre-save hook by using updateOne with a manually hashed password
        const hashed = await bcrypt.hash(String(newPassword), 12);
        await User.updateOne({ _id: user._id }, { $set: { ...updates, password: hashed } });
        return apiSuccess({ message: "Profile and password updated" });
    }

    if (Object.keys(updates).length === 0) return apiError("No valid fields provided", 400);
    await User.updateOne({ _id: user._id }, { $set: updates });

    return apiSuccess({ message: "Profile updated" });
}
