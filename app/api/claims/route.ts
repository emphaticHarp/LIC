import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Claim } from '@/models/Claim';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const claimType = searchParams.get('claimType');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const query: any = {};

    if (search) {
      query.$or = [
        { claimId: { $regex: search, $options: 'i' } },
        { policyId: { $regex: search, $options: 'i' } },
        { claimantName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (claimType) {
      query.claimType = claimType;
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const claims = await Claim.find(query)
      .sort(sort)
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
      claimId,
      policyId,
      customerEmail,
      claimantName,
      claimType,
      amount,
      status,
      priority,
      description,
      dateOfIncident,
    } = body;

    // Validation
    if (!claimId || !policyId || !claimantName || !claimType || !amount || !description || !dateOfIncident) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if claim already exists
    const existingClaim = await Claim.findOne({ claimId });
    if (existingClaim) {
      return NextResponse.json(
        { success: false, error: 'Claim with this ID already exists' },
        { status: 400 }
      );
    }

    const claim = new Claim({
      claimId,
      policyId,
      customerEmail,
      claimantName,
      claimType,
      amount,
      status: status || 'pending',
      priority: priority || 'medium',
      description,
      dateOfIncident: new Date(dateOfIncident),
      dateFiled: new Date(),
      documents: [],
      createdAt: new Date(),
    });

    await claim.save();

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

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { claimId, ...updateData } = body;

    if (!claimId) {
      return NextResponse.json(
        { success: false, error: 'Claim ID is required' },
        { status: 400 }
      );
    }

    const claim = await Claim.findOneAndUpdate(
      { claimId },
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!claim) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: claim,
    });
  } catch (error) {
    console.error('Error updating claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update claim' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const claimId = searchParams.get('claimId');

    if (!claimId) {
      return NextResponse.json(
        { success: false, error: 'Claim ID is required' },
        { status: 400 }
      );
    }

    const result = await Claim.findOneAndDelete({ claimId });

    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Claim not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Claim deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting claim:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete claim' },
      { status: 500 }
    );
  }
}
