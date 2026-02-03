import mongoose from 'mongoose'

const AssetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide an asset name'],
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  type: {
    type: String,
    enum: ['Digital', 'Financial', 'Physical', 'Document', 'Other'],
    default: 'Other',
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  accessInstructions: {
    type: String, // Encrypted ideally, but plain for Demo MVP unless requested specific crypto lib
    required: [true, 'Please provide access instructions'],
  },
  sensitivity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  isArchived: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
})

export default mongoose.models.Asset || mongoose.model('Asset', AssetSchema)
