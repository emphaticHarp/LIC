import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import Policy from '@/models/Policy';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    await connectDB();

    // Build query
    let query: any = {};
    
    if (email) {
      query.customerEmail = email;
    }
    
    if (type && type !== 'all') {
      query.category = type;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const policies = await Policy.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ policies });

  } catch (error) {
    console.error('Get policies error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const policyData = await request.json();

    await connectDB();

    // Check if policy ID already exists
    const existingPolicy = await Policy.findOne({ policyId: policyData.policyId });
    if (existingPolicy) {
      return NextResponse.json(
        { error: 'Policy ID already exists' },
        { status: 400 }
      );
    }

    const policy = new Policy(policyData);
    await policy.save();

    return NextResponse.json(
      { message: 'Policy created successfully', policy },
      { status: 201 }
    );

  } catch (error) {
    console.error('Create policy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
