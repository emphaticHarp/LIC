import mongoose from 'mongoose'

const documentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    documentType: {
      type: String,
      default: 'OTHER',
    },
    relatedType: {
      type: String,
      default: 'CUSTOMER',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: String,
      default: 'user',
    },
    fileData: {
      type: Buffer,
      required: true,
    },
  },
  { strict: false }
)

export const Document = mongoose.models.Document || mongoose.model('Document', documentSchema)
