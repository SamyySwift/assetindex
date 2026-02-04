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
    enum: [
      'Digital', 'Financial', 'Physical', 'Document', 'Other',
      'Crypto Ledger', 'Seed Phrases', 'Stock Portfolio', 'Real Estate Deeds',
      'Social Media Account', 'Insurance Policy', 'Credentials', 'Secret Note', 'Hardware Access'
    ],
    default: 'Other',
  },
  value: {
    type: String, // Monetary or estimated value
    default: '0',
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  accessInstructions: {
    type: String,
    required: [true, 'Please provide access instructions'],
  },
  accessKey: {
    type: String, // Encrypted key/password stored for disclosure
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
