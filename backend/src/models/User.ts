import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  checkInFrequency: {
    type: String,
    enum: ['5 Minutes', 'Weekly', 'Monthly', 'Yearly'],
    default: 'Monthly',
  },
  gracePeriod: {
    type: Number,
    default: 7,
  },
  lastCheckIn: {
    type: Date,
    default: Date.now,
  },
  assetsReleased: {
    type: Boolean,
    default: false,
  },
  warningSent: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// ... imports

// ... imports

interface IUserMethods {
  matchPassword(password: string): Promise<boolean>;
}

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password as string);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
