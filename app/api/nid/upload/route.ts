import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { v2 as cloudinary } from "cloudinary";
import { apiError, apiSuccess } from "@/lib/utils";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/nid/upload — authenticated user uploads NID photo
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return apiError("Unauthorized", 401);

        const formData = await req.formData();
        const file = formData.get("nidImage") as File | null;
        if (!file) return apiError("No image file provided", 400);

        // Convert to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Upload to Cloudinary (secure, private folder)
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "blooddonation/nid",
            resource_type: "image",
            access_mode: "authenticated",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
        });

        await dbConnect();
        // @ts-expect-error custom session fields
        await User.findByIdAndUpdate(session.user.id, {
            nidImage: result.secure_url,
            nidStatus: "pending",
        });

        return apiSuccess({ url: result.secure_url, publicId: result.public_id }, 201);
    } catch (err) {
        console.error("[POST /api/nid/upload]", err);
        return apiError("Internal server error", 500);
    }
}
