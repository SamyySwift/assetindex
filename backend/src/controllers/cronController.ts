import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import AssetAssignment from '../models/AssetAssignment.js';
import dotenv from 'dotenv';

dotenv.config();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
});

async function sendEmail(to: string, subject: string, html: string) {
    console.log(`\n--- SENDING EMAIL (Nodemailer) ---`)
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    
    try {
        const info = await transporter.sendMail({
            from: `"Asset Index" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log('Message sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Email sending failed:', error);
        // Fallback to console for testing if SMTP fails
        console.log(`Fallback Body: ${html.substring(0, 100)}...`)
        return false;
    }
}

// Helper to calculate next check-in date
function getNextCheckInDate(lastCheckIn: Date, frequency: string): Date {
    const date = new Date(lastCheckIn)
    if (frequency === '5 Minutes') date.setMinutes(date.getMinutes() + 5)
    else if (frequency === 'Weekly') date.setDate(date.getDate() + 7)
    else if (frequency === 'Monthly') date.setMonth(date.getMonth() + 1)
    else if (frequency === 'Yearly') date.setFullYear(date.getFullYear() + 1)
    return date
}

// Core logic for checking inactivity and sending notifications
export const checkInactivity = async () => {
    try {
        const users = await User.find({ assetsReleased: false }) // Only check users whose assets aren't released
        let processed = 0
        let notifications = 0

        for (const user of users) {
             const nextCheckIn = getNextCheckInDate(user.lastCheckIn, user.checkInFrequency)
             const now = new Date()

             if (now > nextCheckIn) {
                 const diffTime = Math.abs(now.getTime() - nextCheckIn.getTime())
                 // Use minutes for "5 Minutes" frequency, otherwise days
                 let diffUnits;
                 if (user.checkInFrequency === '5 Minutes') {
                    diffUnits = Math.ceil(diffTime / (1000 * 60))
                 } else {
                    diffUnits = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                 }

                 // For 5 minutes frequency, grace period is also treated as minutes for easier testing
                 const graceLimit = user.checkInFrequency === '5 Minutes' ? user.gracePeriod : user.gracePeriod

                 if (diffUnits <= graceLimit) {
                     if (!user.warningSent) {
                         const sent = await sendEmail(user.email, "Action Required: Check in to Asset Index", "Please <a href='http://localhost:3000/dashboard/settings'>check in here</a> to confirm you are active.")
                         if (sent) {
                             await User.findByIdAndUpdate(user._id, { warningSent: true })
                         }
                         notifications++
                     }
                 } else {
                     if (!user.assetsReleased) {
                         await User.findByIdAndUpdate(user._id, { assetsReleased: true })
                         
                         const contacts = await Contact.find({ userId: user._id })
                         for (const contact of contacts) {
                             // Find specific assets assigned to this contact
                             const assignments = await AssetAssignment.find({ contactId: contact._id, userId: user._id })
                                 .populate('assetId');

                             if (assignments.length > 0) {
                                 const assetListText = assignments.map((a: any) => `<li><strong>${a.assetId.name}</strong> (${a.permissionLevel}): ${a.assetId.accessInstructions || 'No specific instructions provided.'}</li>`).join('');
                                 
                                 const emailBody = `
                                     <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                                         <h1 style="color: #10b981;">Important Security Alert - Asset Index</h1>
                                         <p>We are reaching out to you because <strong>${user.name}</strong> has been inactive for an extended period.</p>
                                         <p>You have been designated as a trusted contact for the following assets:</p>
                                         <ul style="background: #f3f4f6; padding: 20px; border-radius: 8px; list-style: none;">
                                             ${assetListText}
                                         </ul>
                                         <p style="margin-top: 20px;">Please keep this information secure.</p>
                                         <p style="color: #6b7280; font-size: 12px; margin-top: 40px;">This is an automated message from Asset Index.</p>
                                     </div>
                                 `;

                                 await sendEmail(contact.email, `Asset Disclosure related to ${user.name}`, emailBody)
                                 notifications++
                             }
                         }
                     }
                 }
                 processed++
             }
        }
        return { processed, notifications }
    } catch (error) {
        console.error('Error in checkInactivity:', error);
        throw error
    }
}

export const runMonitor = async (req: Request, res: Response) => {
    try {
        const { processed, notifications } = await checkInactivity()
        res.json({ success: true, processed, notifications })
    } catch (error: any) {
        console.error('Cron Monitor API Error:', error);
        res.status(500).json({ error: error.message })
    }
}
