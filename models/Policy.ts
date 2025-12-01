import mongoose from 'mongoose';

const PolicySchema = new mongoose.Schema({
  policyId: {
    type: String,
    required: true,
    unique: true
  },
  customerEmail: {
    type: String,
    required: true,
    ref: 'User'
  },
  customerName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['life', 'health', 'vehicle', 'property'],
    required: true
  },
  premium: {
    type: String,
    required: true
  },
  sumAssured: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'pending'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  nextPremium: {
    type: Date,
    required: true
  },
  customerImage: String,
  documents: [{
    name: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Policy || mongoose.model('Policy', PolicySchema);
