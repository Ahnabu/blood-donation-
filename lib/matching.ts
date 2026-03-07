import type { BloodGroup } from "@/models/DonorProfile";

// ─── ABO + RhD Compatibility Matrix ───────────────────────────────────────────
// Key: recipient blood group → Value: array of compatible DONOR blood groups

export const COMPATIBLE_DONORS: Record<BloodGroup, BloodGroup[]> = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    "AB-": ["A-", "B-", "AB-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"],
};

/**
 * Returns compatible donor blood groups for a given recipient type.
 */
export function getCompatibleDonorGroups(recipient: BloodGroup): BloodGroup[] {
    return COMPATIBLE_DONORS[recipient] ?? [];
}

// ─── Haversine Distance Formula ───────────────────────────────────────────────

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

/**
 * Calculates the great-circle distance between two coordinates in km.
 * @param coord1 [longitude, latitude]
 * @param coord2 [longitude, latitude]
 */
export function haversineDistance(
    coord1: [number, number],
    coord2: [number, number]
): number {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;

    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
}

// ─── Next Eligible Donation Date ─────────────────────────────────────────────

const DEFERRAL_DAYS = 56; // 8 weeks for whole blood

/**
 * Calculates the next eligible donation date from a last donation date.
 */
export function getNextEligibleDate(lastDonated: Date): Date {
    const next = new Date(lastDonated);
    next.setDate(next.getDate() + DEFERRAL_DAYS);
    return next;
}

/**
 * Computes eligibility score (0–100) based on medical history flags.
 * Returns 0 if any hard disqualifier is active, otherwise 100 minus deductions.
 */
export function computeEligibilityScore(medicalHistory: {
    isPregnant: boolean;
    recentTransfusion: boolean;
    transfusionDate?: Date;
    recentTattoo: boolean;
    tattooDate?: Date;
    recentAntibiotics: boolean;
    antibioticEndDate?: Date;
    malariaExposure: boolean;
    malariaDate?: Date;
    hasChronicCondition: boolean;
}): number {
    const now = new Date();

    if (medicalHistory.isPregnant) return 0;
    if (medicalHistory.hasChronicCondition) return 0;

    let score = 100;

    if (
        medicalHistory.recentTransfusion &&
        medicalHistory.transfusionDate &&
        (now.getTime() - medicalHistory.transfusionDate.getTime()) <
        90 * 24 * 60 * 60 * 1000
    ) {
        score -= 100; // hard disqualifier
    }

    if (
        medicalHistory.recentTattoo &&
        medicalHistory.tattooDate &&
        (now.getTime() - medicalHistory.tattooDate.getTime()) <
        365 * 24 * 60 * 60 * 1000
    ) {
        score -= 80;
    }

    if (
        medicalHistory.recentAntibiotics &&
        medicalHistory.antibioticEndDate &&
        now < medicalHistory.antibioticEndDate
    ) {
        score -= 60;
    }

    if (
        medicalHistory.malariaExposure &&
        medicalHistory.malariaDate &&
        (now.getTime() - medicalHistory.malariaDate.getTime()) <
        90 * 24 * 60 * 60 * 1000
    ) {
        score -= 80;
    }

    return Math.max(0, score);
}
