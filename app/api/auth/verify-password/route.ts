import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { password, email } = await request.json()

    console.log('Password verification request received for email:', email)

    if (!password) {
      console.log('Password is missing')
      return NextResponse.json(
        { success: false, message: 'Password is required' },
        { status: 400 }
      )
    }

    if (!email) {
      console.log('Email is missing')
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      console.log('User not found for email:', email)
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    console.log('User found, comparing passwords')

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log('Password is invalid for user:', email)
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
        { status: 401 }
      )
    }

    console.log('Password verified successfully for user:', email)

    return NextResponse.json({
      success: true,
      message: 'Password verified',
    })
  } catch (error) {
    console.error('Error verifying password:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
