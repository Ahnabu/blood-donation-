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
    const hash = await bcrypt.hash(password, 12);

    const existing = await User.findOne({ email });
    if (existing) {
        existing.password = hash;
        existing.role = "admin";
        existing.nidStatus = "approved";
        existing.verified = true;
        await existing.save();
        console.log(`✅ Updated existing user → ${email}`);
    } else {
        await User.create({
            name: "Admin",
            email,
            password: hash,
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
