import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

export async function sendMatchNotification(
    donorEmail: string,
    requestDetails: {
        bloodGroup: string;
        hospitalName: string;
        urgency: string;
        patientName: string;
    }
) {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY.includes("placeholder")) {
        console.warn("Resend API key missing or placeholder. Skipping email send.");
        return;
    }

    try {
        await resend.emails.send({
            from: `Droplet Urgent <${EMAIL_FROM}>`,
            to: donorEmail,
            subject: `URGENT: ${requestDetails.bloodGroup} Blood Needed at ${requestDetails.hospitalName}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px; overflow: hidden;">
                    <div style="background-color: #ef4444; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">URGENT BLOOD REQUEST</h1>
                    </div>
                    <div style="padding: 24px; background-color: #ffffff; color: #333;">
                        <p style="font-size: 16px;">Hello,</p>
                        <p style="font-size: 16px;">There is an urgent <strong>${requestDetails.urgency}</strong> request for <strong>${requestDetails.bloodGroup}</strong> blood in your area.</p>
                        
                        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 24px 0;">
                            <h3 style="margin-top: 0; color: #111827;">Request Details:</h3>
                            <ul style="list-style: none; padding: 0; margin: 0;">
                                <li style="margin-bottom: 8px;"><strong>Patient:</strong> ${requestDetails.patientName}</li>
                                <li style="margin-bottom: 8px;"><strong>Hospital:</strong> ${requestDetails.hospitalName}</li>
                                <li style="margin-bottom: 8px;"><strong>Urgency:</strong> <span style="color: #ef4444; font-weight: bold;">${requestDetails.urgency}</span></li>
                            </ul>
                        </div>

                        <p style="font-size: 16px;">If you are available to donate, please log into your Droplet dashboard immediately to accept the request.</p>
                        
                        <div style="text-align: center; margin-top: 32px;">
                            <a href="${process.env.NEXTAUTH_URL}/dashboard/donor" style="background-color: #ef4444; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Request in Dashboard</a>
                        </div>
                    </div>
                    <div style="background-color: #f9fafb; padding: 16px; text-align: center; color: #6b7280; font-size: 14px;">
                        <p style="margin: 0;">Droplet Donation Platform</p>
                        <p style="margin: 4px 0 0 0;">Saving lives in Dhaka Cantonment</p>
                    </div>
                </div>
            `
        });
        console.log(`Notification sent to ${donorEmail}`);
    } catch (err) {
        console.error("Failed to send email via Resend:", err);
    }
}
