import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'customer' } = await request.json();

    console.log('Registration request received:', { email, name, role });

    if (!email || !password || !name) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Check if user already exists
    console.log('Checking if user exists:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    console.log('Creating user...');
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role,
      isVerified: false,
      verificationToken,
      verificationTokenExpiry,
      profile: {
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1] || '',
        memberSince: new Date()
      }
    });

    await user.save();
    console.log('User created successfully:', email);

    // Return user data with verification token
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      verificationToken: verificationToken,
      profile: user.profile
    };

    return NextResponse.json(
      { 
        message: 'User created successfully. Please verify your email.',
        user: userResponse,
        verificationToken: verificationToken
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Registration error details:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
