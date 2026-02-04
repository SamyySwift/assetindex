import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function checkUserStatus() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const users = await User.find({});
        
        console.log('\n=== USER STATUS CHECK ===\n');
        
        for (const user of users) {
            const now = new Date();
            const lastCheckIn = new Date(user.lastCheckIn);
            const diffMs = now.getTime() - lastCheckIn.getTime();
            const diffMinutes = Math.floor(diffMs / (1000 * 60));
            
            console.log(`User: ${user.name} (${user.email})`);
            console.log(`Check-in Frequency: ${user.checkInFrequency}`);
            console.log(`Grace Period: ${user.gracePeriod}`);
            console.log(`Last Check-in: ${lastCheckIn.toLocaleString()}`);
            console.log(`Minutes since last check-in: ${diffMinutes}`);
            console.log(`Assets Released: ${user.assetsReleased}`);
            
            // Calculate next check-in
            let nextCheckIn = new Date(lastCheckIn);
            if (user.checkInFrequency === '5 Minutes') {
                nextCheckIn.setMinutes(nextCheckIn.getMinutes() + 5);
            } else if (user.checkInFrequency === 'Weekly') {
                nextCheckIn.setDate(nextCheckIn.getDate() + 7);
            } else if (user.checkInFrequency === 'Monthly') {
                nextCheckIn.setMonth(nextCheckIn.getMonth() + 1);
            } else if (user.checkInFrequency === 'Yearly') {
                nextCheckIn.setFullYear(nextCheckIn.getFullYear() + 1);
            }
            
            console.log(`Next Check-in Due: ${nextCheckIn.toLocaleString()}`);
            console.log(`Is Overdue: ${now > nextCheckIn ? 'YES' : 'NO'}`);
            
            if (now > nextCheckIn) {
                const overdueMinutes = Math.floor((now.getTime() - nextCheckIn.getTime()) / (1000 * 60));
                console.log(`Minutes Overdue: ${overdueMinutes}`);
                console.log(`Within Grace Period: ${overdueMinutes <= user.gracePeriod ? 'YES (will send warning)' : 'NO (will release assets)'}`);
            }
            
            console.log('\n---\n');
        }
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUserStatus();
