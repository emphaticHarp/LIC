import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { OTP } from '@/models/OTP';
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

    const { email, otp, purpose = 'EMAIL_VERIFICATION' } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // If email verification, mark user as verified
    if (purpose === 'EMAIL_VERIFICATION') {
      const user = await User.findOne({ email });
      if (user) {
        user.isVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpiry = null;
        await user.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
