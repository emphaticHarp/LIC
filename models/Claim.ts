import mongoose from 'mongoose';

const ClaimSchema = new mongoose.Schema({
  claimId: {
    type: String,
    required: true,
    unique: true
  },
  policyId: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },
  claimantName: {
    type: String,
    required: true
  },
  claimType: {
    type: String,
    required: true,
    enum: ['Life Insurance', 'Health Insurance', 'Vehicle Insurance', 'Home Insurance']
  },
  amount: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'approved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  description: {
    type: String,
    required: true
  },
  dateOfIncident: {
    type: Date,
    required: true
  },
  dateFiled: {
    type: Date,
    default: Date.now
  },
  documents: [{
    name: String,
    url: String,
    type: String,
    size: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  approvedAmount: String,
  approvedDate: Date,
  rejectionReason: String,
  claimantImage: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export const Claim = mongoose.models.Claim || mongoose.model('Claim', ClaimSchema);
