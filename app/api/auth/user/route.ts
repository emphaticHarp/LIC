import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    console.log('Fetching user profile for email:', email);

    if (!email) {
      console.log('No email parameter provided');
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Find user by email
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email }).select('-password');
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('User data retrieved successfully');
    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile: user.profile,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });

  } catch (error: any) {
    console.error('Error fetching user:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
