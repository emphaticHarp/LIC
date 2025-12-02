import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request: NextRequest) {
  try {
    const { email, name, currentPassword, newPassword } = await request.json();

    console.log('Updating profile for email:', email);
    console.log('Update data:', { name, hasCurrentPassword: !!currentPassword, hasNewPassword: !!newPassword });

    if (!email) {
      console.log('No email provided in request');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('MongoDB connected successfully');

    // Find user by email
    console.log('Searching for user with email:', email);
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update name
    if (name) {
      console.log('Updating name to:', name);
      user.name = name;
      user.profile.firstName = name.split(' ')[0];
      user.profile.lastName = name.split(' ')[1] || '';
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        console.log('New password provided but no current password');
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      console.log('Verifying current password...');
      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      console.log('Current password valid:', isCurrentPasswordValid);
      
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash and update new password
      console.log('Hashing new password...');
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedNewPassword;
      console.log('New password hashed and updated');
    }

    // Update timestamp
    user.updatedAt = new Date();

    console.log('Saving user to database...');
    await user.save();
    console.log('User saved successfully');

    // Return updated user data (excluding password)
    const userResponse = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      profile: user.profile,
      isActive: user.isActive,
      updatedAt: user.updatedAt
    };

    return NextResponse.json(
      { 
        message: 'Profile updated successfully', 
        user: userResponse 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error updating profile:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
