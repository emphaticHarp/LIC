import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: Date,
    gender: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    panNumber: String,
    aadhaarNumber: String,
    agentId: mongoose.Schema.Types.ObjectId,
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    documents: [
      {
        type: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    policies: [mongoose.Schema.Types.ObjectId],
    claims: [mongoose.Schema.Types.ObjectId],
    totalPremium: {
      type: Number,
      default: 0,
    },
    totalClaims: {
      type: Number,
      default: 0,
    },
    lastPolicyDate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Customer =
  mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
