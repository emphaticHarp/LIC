import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

// Temporary mock user for testing
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'admin',
  isVerified: true,
  profile: {
    firstName: 'Test',
    lastName: 'User',
    phone: '1234567890',
    address: 'Test Address',
    memberSince: new Date()
  }
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Temporary bypass - accept any credentials for testing
    if (email === 'test@example.com' && password === 'password') {
      return NextResponse.json(
        { message: 'Login successful', user: mockUser },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid credentials. Use test@example.com / password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
