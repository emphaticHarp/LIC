import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Customer } from '@/models/Customer';
import { createAuditLog } from '@/lib/audit';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { customerId: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const customers = await Customer.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Customer.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: customers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { name, email, phone, address, city, state, pincode, panNumber, aadhaarNumber, agentId } = body;

    // Validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Customer with this email already exists' },
        { status: 400 }
      );
    }

    const customer = new Customer({
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      panNumber,
      aadhaarNumber,
      agentId,
      status: 'active',
      kycStatus: 'pending',
      createdAt: new Date(),
    });

    await customer.save();

    // Create audit log
    await createAuditLog({
      action: 'CREATE_CUSTOMER',
      entityType: 'Customer',
      entityId: customer._id.toString(),
      changes: { created: true },
      userId: agentId || 'system',
      timestamp: new Date(),
    });

    return NextResponse.json(
      { success: true, data: customer },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
