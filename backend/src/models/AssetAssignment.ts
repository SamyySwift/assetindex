import mongoose from 'mongoose'

const AssetAssignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  contactId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contact',
    required: true,
  },
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true,
  },
  permissionLevel: {
    type: String,
    enum: ['view', 'edit', 'full_access'],
    default: 'view',
    required: true,
  }
}, {
  timestamps: true,
})

// Ensure a contact can't have duplicate assignments for the same asset
AssetAssignmentSchema.index({ contactId: 1, assetId: 1 }, { unique: true })

export default mongoose.models.AssetAssignment || mongoose.model('AssetAssignment', AssetAssignmentSchema)
