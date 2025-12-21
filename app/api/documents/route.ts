import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Document } from '@/models/Document'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const documents = await Document.find({}).select('-fileData').sort({ createdAt: -1 })
    return NextResponse.json({ success: true, data: documents })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ success: false, message: 'Failed to fetch documents' }, { status: 500 })
  }
}
