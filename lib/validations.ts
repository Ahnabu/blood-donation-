import { z } from "zod";

// ─── Shared ───────────────────────────────────────────────────────────────────

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const DHAKA_CANTONMENT_AREAS = [
    "ECB Chattar",
    "Banani",
    "Baridhara",
    "Nikunja-1",
    "Nikunja-2",
    "Officers' Colony",
    "Sepoy Para",
    "Cantonment Market",
    "Gulshan-1",
    "Gulshan-2",
    "Uttara",
    "Bashundhara",
    "Airport Road",
    "Other",
] as const;
export type CantonmentArea = (typeof DHAKA_CANTONMENT_AREAS)[number];
const bloodGroupEnum = z.enum(BLOOD_GROUPS);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(100),
    role: z.enum(["donor", "receiver"]),
    phone: z.string().min(1, "Phone number is required"),
    dateOfBirth: z.string().optional(),
    bloodGroup: bloodGroupEnum.optional(),
    lastDonated: z.string().optional(),
    cause: z.string().optional(),
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// ─── Donor Profile ────────────────────────────────────────────────────────────

export const donorProfileSchema = z.object({
    bloodGroup: bloodGroupEnum,
    area: z.enum(DHAKA_CANTONMENT_AREAS).optional(),
    coordinates: z
        .tuple([z.number(), z.number()])
        .describe("[longitude, latitude]"),
    age: z.number().int().min(18).max(65),
    weight: z.number().min(50),
    lastDonated: z.string().datetime().optional().or(z.null()),
    medicalHistory: z.object({
        hasChronicCondition: z.boolean().default(false),
        chronicConditionDetails: z.string().optional(),
        recentTattoo: z.boolean().default(false),
        tattooDate: z.string().datetime().optional().or(z.null()),
        recentAntibiotics: z.boolean().default(false),
        antibioticEndDate: z.string().datetime().optional().or(z.null()),
        malariaExposure: z.boolean().default(false),
        malariaDate: z.string().datetime().optional().or(z.null()),
        isPregnant: z.boolean().default(false),
        recentTransfusion: z.boolean().default(false),
        transfusionDate: z.string().datetime().optional().or(z.null()),
    }),
});

// ─── Receiver Request ─────────────────────────────────────────────────────────

export const bloodRequestSchema = z.object({
    patientName: z.string().min(2).max(100),
    phone: z.string().min(10).max(15),
    bloodGroup: bloodGroupEnum,
    hospitalName: z.string().min(2).max(200),
    wardOrBed: z.string().optional(),
    district: z.string().min(2),
    unitsRequired: z.number().int().min(1).max(50),
    reason: z.string().min(10).max(1000),
    urgency: z.enum(["Routine", "Urgent", "STAT"]),
});

// ─── Inventory ────────────────────────────────────────────────────────────────

export const inventorySchema = z.object({
    bloodGroup: bloodGroupEnum,
    units: z.number().int().min(1),
    collectedAt: z.string().datetime(),
    expiresAt: z.string().datetime(),
    storageLocation: z.string().min(2).max(200),
});

// ─── NID Review ───────────────────────────────────────────────────────────────

export const nidReviewSchema = z.object({
    userId: z.string().min(1),
    action: z.enum(["approved", "rejected"]),
    adminNotes: z.string().max(500).optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type DonorProfileInput = z.infer<typeof donorProfileSchema>;
export type BloodRequestInput = z.infer<typeof bloodRequestSchema>;
export type InventoryInput = z.infer<typeof inventorySchema>;
export type NidReviewInput = z.infer<typeof nidReviewSchema>;
