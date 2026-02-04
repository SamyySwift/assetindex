import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function resetUserForTesting() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Reset all users' assetsReleased flag and update lastCheckIn to now
        const result = await User.updateMany(
            {},
            {
                assetsReleased: false,
                lastCheckIn: new Date()
            }
        );
        
        console.log(`\n✅ Reset ${result.modifiedCount} user(s) for testing`);
        console.log('- Set assetsReleased to false');
        console.log('- Updated lastCheckIn to now');
        console.log('\nYou can now wait 5+ minutes and trigger the cron monitor again.');
        
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

resetUserForTesting();
