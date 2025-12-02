import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  uploadDocument,
  getDocuments,
  logDocumentAccess,
  getDocumentAccessLogs,
  createDocumentVersion,
  deleteDocument,
} from '@/lib/document-management';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'list';
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');
    const documentType = searchParams.get('documentType');
    const documentId = searchParams.get('documentId');

    if (action === 'list') {
      if (!entityType || !entityId) {
        return NextResponse.json(
          { success: false, error: 'entityType and entityId required' },
          { status: 400 }
        );
      }

      const result = await getDocuments(entityType, entityId, documentType);
      return NextResponse.json(result);
    }

    if (action === 'access_logs') {
      if (!documentId) {
        return NextResponse.json(
          { success: false, error: 'documentId required' },
          { status: 400 }
        );
      }

      const result = await getDocumentAccessLogs(documentId);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in documents API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action } = body;

    if (action === 'upload') {
      const {
        fileName,
        fileType,
        fileSize,
        fileUrl,
        entityType,
        entityId,
        documentType,
        uploadedBy,
        metadata,
      } = body;

      if (!fileName || !fileType || !fileUrl || !entityType || !entityId || !uploadedBy) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const result = await uploadDocument(
        fileName,
        fileType,
        fileSize,
        fileUrl,
        entityType,
        entityId,
        documentType,
        uploadedBy,
        metadata
      );

      return NextResponse.json(result, { status: result.success ? 201 : 400 });
    }

    if (action === 'log_access') {
      const { documentId, accessedBy, accessType, ipAddress, userAgent } = body;

      if (!documentId || !accessedBy || !accessType) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const result = await logDocumentAccess(
        documentId,
        accessedBy,
        accessType,
        ipAddress,
        userAgent
      );

      return NextResponse.json(result);
    }

    if (action === 'create_version') {
      const { documentId, newFileUrl, uploadedBy } = body;

      if (!documentId || !newFileUrl || !uploadedBy) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const result = await createDocumentVersion(documentId, newFileUrl, uploadedBy);
      return NextResponse.json(result);
    }

    if (action === 'delete') {
      const { documentId, deletedBy } = body;

      if (!documentId || !deletedBy) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const result = await deleteDocument(documentId, deletedBy);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing document request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
