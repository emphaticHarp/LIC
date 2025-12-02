import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { createAuditLog } from '@/lib/audit';

const PaymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true },
    customerId: mongoose.Schema.Types.ObjectId,
    policyId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'net_banking', 'upi', 'cheque'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentDate: Date,
    dueDate: Date,
    receiptNumber: String,
    description: String,
    gatewayResponse: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Payment =
  mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const policyId = searchParams.get('policyId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (policyId) query.policyId = policyId;

    if (startDate || endDate) {
      query.paymentDate = {};
      if (startDate) query.paymentDate.$gte = new Date(startDate);
      if (endDate) query.paymentDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const payments = await Payment.find(query)
      .sort({ paymentDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Payment.countDocuments(query);

    const totalAmount = await Payment.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return NextResponse.json({
      success: true,
      data: payments,
      totalAmount: totalAmount[0]?.total || 0,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      customerId,
      policyId,
      amount,
      paymentMethod,
      dueDate,
      description,
      userId,
    } = body;

    if (!customerId || !policyId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const receiptNumber = `RCP-${Date.now()}`;

    const payment = new Payment({
      transactionId,
      customerId,
      policyId,
      amount,
      paymentMethod,
      dueDate,
      description,
      receiptNumber,
      status: 'pending',
      paymentDate: new Date(),
    });

    await payment.save();

    await createAuditLog({
      action: 'CREATE_PAYMENT',
      entityType: 'Payment',
      entityId: payment._id.toString(),
      changes: { created: true, transactionId, amount },
      userId: userId || 'system',
    });

    return NextResponse.json(
      { success: true, data: payment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment' },
      { status: 500 }
    );
  }
}
