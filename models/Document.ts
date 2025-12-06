import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: Number,
    fileData: {
      type: Buffer,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedId: String, // Customer ID, Loan ID, Policy ID, etc.
    relatedType: {
      type: String,
      enum: ['CUSTOMER', 'LOAN', 'POLICY', 'CLAIM', 'KYC'],
      required: true,
    },
    documentType: {
      type: String,
      enum: ['PAN', 'AADHAAR', 'PASSPORT', 'DRIVING_LICENSE', 'BANK_STATEMENT', 'SALARY_SLIP', 'POLICY_DOCUMENT', 'CLAIM_PROOF', 'OTHER'],
      required: true,
    },
    description: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedBy: mongoose.Schema.Types.ObjectId,
    verificationDate: Date,
    expiryDate: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export const Document =
  mongoose.models.Document || mongoose.model('Document', DocumentSchema);
