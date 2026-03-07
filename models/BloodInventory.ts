import mongoose, { Schema, Document, Model } from "mongoose";
import type { BloodGroup } from "./DonorProfile";

export interface IBloodInventory extends Document {
    bloodGroup: BloodGroup;
    units: number;
    collectedAt: Date;
    expiresAt: Date;
    storageLocation: string;
    managedBy: mongoose.Types.ObjectId;
    isExpired: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BloodInventorySchema = new Schema<IBloodInventory>(
    {
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        units: { type: Number, required: true, min: 0 },
        collectedAt: { type: Date, required: true, default: Date.now },
        expiresAt: { type: Date, required: true },
        storageLocation: { type: String, required: true, default: "Main Blood Bank" },
        managedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
        isExpired: { type: Boolean, default: false },
    },
    { timestamps: true }
);

BloodInventorySchema.index({ bloodGroup: 1 });
BloodInventorySchema.index({ expiresAt: 1 });
BloodInventorySchema.index({ isExpired: 1, bloodGroup: 1 });

const BloodInventory: Model<IBloodInventory> =
    mongoose.models.BloodInventory ||
    mongoose.model<IBloodInventory>("BloodInventory", BloodInventorySchema);

export default BloodInventory;
