import { Request, Response } from 'express';
import User from '../models/User.js';
import Contact from '../models/Contact.js';

// Helper mock email function
async function sendEmail(to: string, subject: string, html: string) {
    console.log(`\n--- SENDING EMAIL (Background) ---`)
    console.log(`To: ${to}`)
    console.log(`Subject: ${subject}`)
    console.log(`Body: ${html.substring(0, 50)}...`)
    console.log(`----------------------------------\n`)
    return true
}

// Helper to calculate next check-in date
function getNextCheckInDate(lastCheckIn: Date, frequency: string): Date {
    const date = new Date(lastCheckIn)
    if (frequency === 'Weekly') date.setDate(date.getDate() + 7)
    else if (frequency === 'Monthly') date.setMonth(date.getMonth() + 1)
    else if (frequency === 'Yearly') date.setFullYear(date.getFullYear() + 1)
    return date
}

export const runMonitor = async (req: Request, res: Response) => {
    try {
        const users = await User.find({})
        let processed = 0
        let notifications = 0

        for (const user of users) {
             const nextCheckIn = getNextCheckInDate(user.lastCheckIn, user.checkInFrequency)
             const now = new Date()

             if (now > nextCheckIn) {
                 const diffTime = Math.abs(now.getTime() - nextCheckIn.getTime())
                 const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 

                 if (diffDays <= user.gracePeriod) {
                     await sendEmail(user.email, "Action Required: Check in to Asset Index", "Please check in to confirm you are active.")
                     notifications++
                 } else {
                     if (!user.assetsReleased) {
                         await User.findByIdAndUpdate(user._id, { assetsReleased: true })
                         
                         const contacts = await Contact.find({ userId: user._id, status: 'Active' })
                         for (const contact of contacts) {
                             const accessLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/disclosure/${contact._id}?key=${user._id}`
                             await sendEmail(contact.email, "Important Security Alert - Asset Index", `${user.name} has not checked in. Assets have been released. Access here: ${accessLink}`)
                             notifications++
                         }
                     }
                 }
                 processed++
             }
        }

        res.json({ success: true, processed, notifications })
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}
