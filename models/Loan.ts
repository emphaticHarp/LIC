import mongoose from 'mongoose';

const LoanSchema = new mongoose.Schema(
  {
    loanId: {
      type: String,
      unique: true,
      sparse: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      sparse: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: Date,
    loanType: {
      type: String,
      enum: ['personal', 'bike', 'car', 'home', 'education', 'business'],
      required: true,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    tenure: {
      type: Number,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    emi: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    totalInterest: {
      type: Number,
      required: true,
    },
    annualIncome: {
      type: Number,
      required: true,
    },
    employmentType: {
      type: String,
      enum: ['salaried', 'self-employed', 'business', 'retired'],
      required: true,
    },
    existingLoans: {
      type: Number,
      default: 0,
    },
    creditScore: Number,
    additionalInfo: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'disbursed'],
      default: 'pending',
    },
    agentSignature: String,
    customerSignature: String,
    documents: [
      {
        name: String,
        checked: Boolean,
      },
    ],
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    kycVerifiedBy: String,
    kycVerificationDate: Date,
    kycNotes: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'completed'],
      default: 'pending',
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: function() {
        return this.totalAmount;
      },
    },
    paymentHistory: [
      {
        amount: Number,
        paymentMethod: String,
        transactionId: String,
        paymentDate: Date,
        notes: String,
      },
    ],
    reminders: [
      {
        reminderType: String,
        message: String,
        dueDate: Date,
        sentDate: Date,
        status: String,
      },
    ],
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

export const Loan =
  mongoose.models.Loan || mongoose.model('Loan', LoanSchema);
