import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Document } from '@/models/Document'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ success: false, message: 'Document ID required' }, { status: 400 })
    }

    await connectDB()
    const document = await Document.findById(id)

    if (!document) {
      return NextResponse.json({ success: false, message: 'Document not found' }, { status: 404 })
    }

    return new NextResponse(document.fileData, {
      headers: {
        'Content-Type': document.fileType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${document.fileName}"`,
        'Content-Length': document.fileSize.toString(),
      },
    })
  } catch (error) {
    console.error('Error downloading document:', error)
    return NextResponse.json({ success: false, message: 'Failed to download document' }, { status: 500 })
  }
}
