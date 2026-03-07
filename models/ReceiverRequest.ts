import mongoose, { Schema, Document, Model } from "mongoose";
import type { BloodGroup } from "./DonorProfile";

export type UrgencyLevel = "Routine" | "Urgent" | "STAT";
export type RequestStatus =
    | "Pending"
    | "Approved"
    | "InTransit"
    | "Fulfilled"
    | "Cancelled";

export interface IReceiverRequest extends Document {
    receiverId: mongoose.Types.ObjectId;
    patientName: string;
    phone: string;
    bloodGroup: BloodGroup;
    hospitalName: string;
    wardOrBed?: string;
    district: string;
    unitsRequired: number;
    reason: string;
    urgency: UrgencyLevel;
    status: RequestStatus;
    matchedDonors: mongoose.Types.ObjectId[];
    adminNotes?: string;
    medicalDocUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ReceiverRequestSchema = new Schema<IReceiverRequest>(
    {
        receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        patientName: { type: String, required: true, trim: true },
        phone: { type: String, required: true },
        bloodGroup: {
            type: String,
            enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
            required: true,
        },
        hospitalName: { type: String, required: true },
        wardOrBed: { type: String },
        district: { type: String, required: true },
        unitsRequired: { type: Number, required: true, min: 1 },
        reason: { type: String, required: true },
        urgency: {
            type: String,
            enum: ["Routine", "Urgent", "STAT"],
            required: true,
            default: "Routine",
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "InTransit", "Fulfilled", "Cancelled"],
            default: "Pending",
        },
        matchedDonors: [{ type: Schema.Types.ObjectId, ref: "User" }],
        adminNotes: { type: String },
        medicalDocUrl: { type: String },
    },
    { timestamps: true }
);

ReceiverRequestSchema.index({ status: 1 });
ReceiverRequestSchema.index({ urgency: 1 });
ReceiverRequestSchema.index({ bloodGroup: 1 });
ReceiverRequestSchema.index({ receiverId: 1, createdAt: -1 });
ReceiverRequestSchema.index({ createdAt: -1 });

const ReceiverRequest: Model<IReceiverRequest> =
    mongoose.models.ReceiverRequest ||
    mongoose.model<IReceiverRequest>("ReceiverRequest", ReceiverRequestSchema);

export default ReceiverRequest;
