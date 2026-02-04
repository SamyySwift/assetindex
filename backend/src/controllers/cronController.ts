import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import AssetAssignment from '../models/AssetAssignment.js';
import dotenv from 'dotenv';
import { getWarningEmail, getDisclosureEmail } from '../utils/emailTemplates.js';

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
                         const checkInUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard/settings`;
                         const emailHtml = getWarningEmail(user.name, checkInUrl);
                         const sent = await sendEmail(user.email, "Action Required: Security Verification", emailHtml)
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
                                 const assetsForTemplate = assignments.map((a: any) => ({
                                     name: a.assetId.name,
                                     instructions: a.assetId.accessInstructions || 'No specific instructions provided.',
                                     level: a.permissionLevel
                                 }));
                                 
                                 const emailBody = getDisclosureEmail(user.name, assetsForTemplate);

                                 await sendEmail(contact.email, `Security Alert: Asset Disclosure related to ${user.name}`, emailBody)
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
