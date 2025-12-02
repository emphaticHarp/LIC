import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { createAuditLog } from '@/lib/audit';

const CommissionSchema = new mongoose.Schema(
  {
    commissionId: { type: String, unique: true },
    agentId: mongoose.Schema.Types.ObjectId,
    policyId: mongoose.Schema.Types.ObjectId,
    commissionAmount: Number,
    commissionRate: Number,
    policyPremium: Number,
    status: {
      type: String,
      enum: ['pending', 'calculated', 'approved', 'paid'],
      default: 'pending',
    },
    payoutDate: Date,
    approvedBy: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Commission =
  mongoose.models.Commission ||
  mongoose.model('Commission', CommissionSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const agentId = searchParams.get('agentId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = {};
    if (agentId) query.agentId = agentId;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const commissions = await Commission.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Commission.countDocuments(query);

    const totalCommission = await Commission.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$commissionAmount' } } },
    ]);

    return NextResponse.json({
      success: true,
      data: commissions,
      totalCommission: totalCommission[0]?.total || 0,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching commissions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch commissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      agentId,
      policyId,
      policyPremium,
      commissionRate,
      userId,
    } = body;

    if (!agentId || !policyId || !policyPremium || !commissionRate) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const commissionAmount = (policyPremium * commissionRate) / 100;
    const commissionId = `COM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const commission = new Commission({
      commissionId,
      agentId,
      policyId,
      policyPremium,
      commissionRate,
      commissionAmount,
      status: 'calculated',
    });

    await commission.save();

    await createAuditLog({
      action: 'CREATE_COMMISSION',
      entityType: 'Commission',
      entityId: commission._id.toString(),
      changes: {
        created: true,
        commissionId,
        amount: commissionAmount,
      },
      userId: userId || 'system',
    });

    return NextResponse.json(
      { success: true, data: commission },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating commission:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create commission' },
      { status: 500 }
    );
  }
}
