import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
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

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { email, purpose = 'EMAIL_VERIFICATION' } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists (for password reset)
    if (purpose === 'PASSWORD_RESET') {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'Email not found' },
          { status: 404 }
        );
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      purpose,
      expiresAt,
    });

    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const subject =
      purpose === 'PASSWORD_RESET'
        ? 'LIC - Password Reset OTP'
        : 'LIC - Email Verification OTP';

    const message =
      purpose === 'PASSWORD_RESET'
        ? 'Your password reset OTP is valid for 10 minutes.'
        : 'Your email verification OTP is valid for 10 minutes.';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #003366 0%, #0066cc 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
            <h1>LIC - One Time Password</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9; border-radius: 0 0 5px 5px;">
            <p>Hello,</p>
            <p>${message}</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: white; padding: 20px; border: 2px solid #0066cc; border-radius: 5px; display: inline-block;">
                <p style="margin: 0; font-size: 12px; color: #666;">Your OTP is:</p>
                <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #0066cc; letter-spacing: 5px;">
                  ${otp}
                </p>
              </div>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Do not share this OTP with anyone. If you did not request this, please ignore this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email',
    });
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
