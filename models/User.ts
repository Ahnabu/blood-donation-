import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "donor" | "receiver" | "admin";
export type NidStatus = "none" | "pending" | "approved" | "rejected";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    nidStatus: NidStatus;
    nidImage?: string;
    verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(plain: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: { type: String, required: true, select: false, minlength: 8 },
        role: {
            type: String,
            enum: ["donor", "receiver", "admin"],
            required: true,
            default: "donor",
        },
        phone: { type: String, trim: true },
        nidStatus: {
            type: String,
            enum: ["none", "pending", "approved", "rejected"],
            default: "none",
        },
        nidImage: { type: String },
        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ nidStatus: 1 });

// Hash password before save
UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

UserSchema.methods.comparePassword = async function (
    plain: string
): Promise<boolean> {
    return bcrypt.compare(plain, this.password);
};

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
