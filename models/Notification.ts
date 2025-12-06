import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['LOAN_REMINDER', 'POLICY_RENEWAL', 'CLAIM_UPDATE', 'PAYMENT_DUE', 'GENERAL'],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedId: String, // Loan ID, Policy ID, Claim ID, etc.
    relatedType: {
      type: String,
      enum: ['LOAN', 'POLICY', 'CLAIM', 'PAYMENT'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    actionUrl: String,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

export const Notification =
  mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
