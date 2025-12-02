import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { createAuditLog } from '@/lib/audit';

const ClaimSchema = new mongoose.Schema(
  {
    claimId: { type: String, unique: true },
    policyId: mongoose.Schema.Types.ObjectId,
    customerId: mongoose.Schema.Types.ObjectId,
    claimAmount: Number,
    claimType: String,
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected', 'paid'],
      default: 'submitted',
    },
    description: String,
    documents: [String],
    submittedDate: Date,
    approvedDate: Date,
    paidDate: Date,
    approvedBy: String,
    rejectionReason: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Claim = mongoose.models.Claim || mongoose.model('Claim', ClaimSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const policyId = searchParams.get('policyId');

    const query: any = {};
    if (status) query.status = status;
    if (customerId) query.customerId = customerId;
    if (policyId) query.policyId = policyId;

    const skip = (page - 1) * limit;

    const claims = await Claim.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Claim.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: claims,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch claims' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      policyId,
      customerId,
      claimAmount,
      claimType,
      description,
      documents,
      userId,
    } = body;

    if (!policyId || !customerId || !claimAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const claimId = `CLM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const claim = new Claim({
      claimId,
      policyId,
      customerId,
      claimAmount,
      claimType,
      description,
      documents: documents || [],
      status: 'submitted',
      submittedDate: new Date(),
    });

    await claim.save();

    await createAuditLog({
      action: 'CREATE_CLAIM',
      entityType: 'Claim',
      entityId: claim._id.toString(),
      changes: { created: true, claimId },
      userId: userId || 'system',
    });

    return NextResponse.json(
      { success: true, data: claim },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create claim' },
      { status: 500 }
    );
  }
}
