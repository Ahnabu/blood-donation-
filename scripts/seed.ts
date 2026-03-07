import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User";
import DonorProfile from "../models/DonorProfile";
import BloodInventory from "../models/BloodInventory";
import ReceiverRequest from "../models/ReceiverRequest";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function seed() {
    try {
        console.log("🌱 Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI as string);
        console.log("✅ Connected.");

        console.log("🧹 Clearing existing collections...");
        await Promise.all([
            User.deleteMany({}),
            DonorProfile.deleteMany({}),
            BloodInventory.deleteMany({}),
            ReceiverRequest.deleteMany({}),
        ]);
        console.log("✅ Cleared.");

        const hashedPassword = await bcrypt.hash("password123", 12);

        // 1. Create Superadmin
        const admin = await User.create({
            name: "Super Admin",
            email: "admin@lifelink.bd",
            password: hashedPassword,
            role: "admin",
            nidStatus: "approved",
            verified: true,
            phone: "+8801700000000",
        });
        console.log("👑 Admin created:", admin.email);

        // 2. Create Donors
        const donors = await User.insertMany([
            { name: "John Doe", email: "donor1@test.com", password: hashedPassword, role: "donor", verified: true, nidStatus: "approved" },
            { name: "Jane Smith", email: "donor2@test.com", password: hashedPassword, role: "donor", verified: true, nidStatus: "approved" },
            { name: "Rafiqul Islam", email: "donor3@test.com", password: hashedPassword, role: "donor", verified: true, nidStatus: "approved" },
        ]);

        await DonorProfile.insertMany([
            { userId: donors[0]._id, bloodGroup: "O+", district: "Dhaka", location: { type: "Point", coordinates: [90.4125, 23.8103] }, totalDonations: 2, reliabilityScore: 98, age: 25, weight: 65, isAvailable: true },
            { userId: donors[1]._id, bloodGroup: "A-", district: "Chattogram", location: { type: "Point", coordinates: [91.8315, 22.3569] }, totalDonations: 0, reliabilityScore: 100, age: 30, weight: 55, isAvailable: true },
            { userId: donors[2]._id, bloodGroup: "AB+", district: "Dhaka", location: { type: "Point", coordinates: [90.4000, 23.7500] }, totalDonations: 5, reliabilityScore: 85, age: 40, weight: 75, lastDonated: new Date("2023-12-01"), isAvailable: true },
        ]);
        console.log("🩸 3 Donors created.");

        // 3. Create Receiver
        const receiver = await User.create({
            name: "Patient X Family", email: "receiver1@test.com", password: hashedPassword, role: "receiver", verified: true, nidStatus: "approved"
        });

        await ReceiverRequest.create({
            receiverId: receiver._id,
            patientName: "Patient X",
            phone: "01800000000",
            bloodGroup: "O+",
            urgency: "Urgent",
            unitsRequired: 2,
            location: { type: "Point", coordinates: [90.41, 23.81] },
            hospitalName: "Dhaka Medical College",
            reason: "Surgery",
            status: "Pending",
            neededBy: new Date(Date.now() + 86400000 * 2), // 2 days from now
        });
        console.log("🏥 Receiver and blood request created.");

        // 4. Create Inventory
        await BloodInventory.insertMany([
            { bloodGroup: "O+", units: 10, collectedAt: new Date(), expiresAt: new Date(Date.now() + 86400000 * 30), managedBy: admin._id, location: "Main Blood Bank" },
            { bloodGroup: "A-", units: 2, collectedAt: new Date(), expiresAt: new Date(Date.now() + 86400000 * 25), managedBy: admin._id, location: "Main Blood Bank" },
            { bloodGroup: "B+", units: 5, collectedAt: new Date(), expiresAt: new Date(Date.now() + 86400000 * 15), managedBy: admin._id, location: "Main Blood Bank" },
        ]);
        console.log("📦 Inventory seeded.");

        console.log("✅ Seeding complete.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Seed error:", err);
        process.exit(1);
    }
}

seed();
