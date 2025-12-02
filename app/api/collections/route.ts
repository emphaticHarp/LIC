import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { createAuditLog } from '@/lib/audit';

const CollectionSchema = new mongoose.Schema(
  {
    collectionId: { type: String, unique: true },
    agentId: mongoose.Schema.Types.ObjectId,
    customerId: mongoose.Schema.Types.ObjectId,
    policyId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    collectionDate: Date,
    paymentMethod: String,
    receiptNumber: String,
    status: {
      type: String,
      enum: ['collected', 'pending', 'failed'],
      default: 'collected',
    },
    remarks: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Collection =
  mongoose.models.Collection ||
  mongoose.model('Collection', CollectionSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const agentId = searchParams.get('agentId');
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const query: any = {};
    if (agentId) query.agentId = agentId;
    if (customerId) query.customerId = customerId;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.collectionDate = {};
      if (startDate) query.collectionDate.$gte = new Date(startDate);
      if (endDate) query.collectionDate.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const collections = await Collection.find(query)
      .sort({ collectionDate: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Collection.countDocuments(query);

    const totalCollected = await Collection.aggregate([
      { $match: { ...query, status: 'collected' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return NextResponse.json({
      success: true,
      data: collections,
      totalCollected: totalCollected[0]?.total || 0,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch collections' },
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
      customerId,
      policyId,
      amount,
      paymentMethod,
      remarks,
      userId,
    } = body;

    if (!agentId || !customerId || !policyId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const collectionId = `COL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const receiptNumber = `RCP-${Date.now()}`;

    const collection = new Collection({
      collectionId,
      agentId,
      customerId,
      policyId,
      amount,
      paymentMethod,
      receiptNumber,
      remarks,
      collectionDate: new Date(),
      status: 'collected',
    });

    await collection.save();

    await createAuditLog({
      action: 'CREATE_COLLECTION',
      entityType: 'Collection',
      entityId: collection._id.toString(),
      changes: {
        created: true,
        collectionId,
        amount,
      },
      userId: userId || 'system',
    });

    return NextResponse.json(
      { success: true, data: collection },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create collection' },
      { status: 500 }
    );
  }
}
