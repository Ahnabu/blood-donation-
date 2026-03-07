import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI not set in .env.local");

async function main() {
    await mongoose.connect(MONGODB_URI as string);
    console.log("Connected to MongoDB.");

    const email = "admin@canttblood.com";
    const password = "Cannt@blood";

    const existing = await User.findOne({ email });
    if (existing) {
        // Use updateOne with a pre-hashed value to bypass the pre-save double-hash
        const hash = await bcrypt.hash(password, 12);
        await User.updateOne(
            { email },
            { $set: { password: hash, role: "admin", nidStatus: "approved", verified: true } }
        );
        console.log(`✅ Updated existing user → ${email}`);
    } else {
        // .create() triggers pre-save hook — pass plain password so it's hashed once
        await User.create({
            name: "Admin",
            email,
            password,
            role: "admin",
            nidStatus: "approved",
            verified: true,
            phone: "+8801700000001",
        });
        console.log(`✅ Admin created → ${email}`);
    }

    await mongoose.disconnect();
    console.log("Done.");
}

main().catch((e) => { console.error(e); process.exit(1); });
