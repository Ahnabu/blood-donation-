import mongoose, { Schema, Document, Model } from "mongoose";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export interface IMedicalHistory {
  hasChronicCondition: boolean;
  chronicConditionDetails?: string;
  recentTattoo: boolean;
  tattooDate?: Date;
  recentAntibiotics: boolean;
  antibioticEndDate?: Date;
  malariaExposure: boolean;
  malariaDate?: Date;
  isPregnant: boolean;
  recentTransfusion: boolean;
  transfusionDate?: Date;
  updatedAt: Date;
}

export interface IDonorProfile extends Document {
  userId: mongoose.Types.ObjectId;
  bloodGroup: BloodGroup;
  location: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  area?: string;
  lastDonated?: Date;
  nextEligibleDate?: Date;
  age?: number;
  weight?: number; // kg
  medicalHistory: IMedicalHistory;
  reliabilityScore: number; // 0–100
  totalDonations: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MedicalHistorySchema = new Schema<IMedicalHistory>(
  {
    hasChronicCondition: { type: Boolean, default: false },
    chronicConditionDetails: { type: String },
    recentTattoo: { type: Boolean, default: false },
    tattooDate: { type: Date },
    recentAntibiotics: { type: Boolean, default: false },
    antibioticEndDate: { type: Date },
    malariaExposure: { type: Boolean, default: false },
    malariaDate: { type: Date },
    isPregnant: { type: Boolean, default: false },
    recentTransfusion: { type: Boolean, default: false },
    transfusionDate: { type: Date },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const DonorProfileSchema = new Schema<IDonorProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    area: { type: String, default: "" },
    lastDonated: { type: Date },
    nextEligibleDate: { type: Date },
    age: { type: Number, min: 18, max: 65 },
    weight: { type: Number, min: 45 },
    medicalHistory: { type: MedicalHistorySchema, default: () => ({}) },
    reliabilityScore: { type: Number, default: 50, min: 0, max: 100 },
    totalDonations: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DonorProfileSchema.index({ location: "2dsphere" });
DonorProfileSchema.index({ bloodGroup: 1 });
DonorProfileSchema.index({ nextEligibleDate: 1 });
DonorProfileSchema.index({ isAvailable: 1, bloodGroup: 1 });

const DonorProfile: Model<IDonorProfile> =
  mongoose.models.DonorProfile ||
  mongoose.model<IDonorProfile>("DonorProfile", DonorProfileSchema);

export default DonorProfile;
