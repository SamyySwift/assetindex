import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a contact name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide a contact email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  relationship: {
    type: String,
    enum: ['Family', 'Friend', 'Legal', 'Other'],
    default: 'Family',
  },
  status: {
    type: String,
    enum: ['Pending', 'Active', 'Declined'],
    default: 'Pending',
  }
}, {
  timestamps: true,
})

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
