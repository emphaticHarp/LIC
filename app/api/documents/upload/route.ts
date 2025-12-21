import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { Document } from '@/models/Document'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('documentType') as string

    console.log('File:', file?.name, 'Type:', file?.type, 'Size:', file?.size)
    console.log('Document Type:', documentType)

    if (!file) {
      console.error('No file provided')
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 })
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const fileName = file.name
    const fileType = file.type
    const fileSize = file.size

    console.log('Connecting to DB...')
    await connectDB()
    console.log('Connected to DB')

    const document = new Document({
      fileName,
      fileType,
      fileSize,
      documentType: documentType || 'OTHER',
      relatedType: 'CUSTOMER',
      uploadedBy: 'user',
      fileData: fileBuffer,
    })

    console.log('Saving document...')
    await document.save()
    console.log('Document saved:', document._id)

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        _id: document._id,
        fileName: document.fileName,
        fileType: document.fileType,
        fileSize: document.fileSize,
        documentType: document.documentType,
        createdAt: document.createdAt,
      },
    })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json({ success: false, message: 'Failed to upload document', error: String(error) }, { status: 500 })
  }
}
