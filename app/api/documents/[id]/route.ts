import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Document } from '@/models/Document'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, message: 'Document ID required' }, { status: 400 })
    }

    await connectDB()
    const result = await Document.findByIdAndDelete(id)

    if (!result) {
      return NextResponse.json({ success: false, message: 'Document not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ success: false, message: 'Failed to delete document' }, { status: 500 })
  }
}
