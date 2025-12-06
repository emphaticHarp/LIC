import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/User';

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(MONGODB_URI || '');
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, exists: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await User.findOne({ email });

    return NextResponse.json({
      success: true,
      exists: !!user,
    });
  } catch (error: any) {
    console.error('Check email error:', error);
    return NextResponse.json(
      { success: false, exists: false, error: error.message },
      { status: 500 }
    );
  }
}
