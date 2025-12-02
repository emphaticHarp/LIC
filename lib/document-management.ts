import mongoose from 'mongoose';
import { createAuditLog } from './audit';

const DocumentSchema = new mongoose.Schema(
  {
    documentId: { type: String, unique: true },
    fileName: String,
    fileType: String,
    fileSize: Number,
    fileUrl: String,
    entityType: String, // customer, policy, claim, etc.
    entityId: mongoose.Schema.Types.ObjectId,
    documentType: String, // KYC, Policy, Claim, etc.
    uploadedBy: mongoose.Schema.Types.ObjectId,
    uploadedAt: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    metadata: mongoose.Schema.Types.Mixed,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const DocumentAccessLogSchema = new mongoose.Schema(
  {
    logId: { type: String, unique: true },
    documentId: String,
    accessedBy: mongoose.Schema.Types.ObjectId,
    accessType: {
      type: String,
      enum: ['view', 'download', 'share', 'delete'],
    },
    accessedAt: { type: Date, default: Date.now },
    ipAddress: String,
    userAgent: String,
  },
  { timestamps: true }
);

const DocumentTemplateSchema = new mongoose.Schema(
  {
    templateId: { type: String, unique: true },
    name: String,
    type: String, // policy, claim, etc.
    content: String,
    variables: [String],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Document =
  mongoose.models.Document || mongoose.model('Document', DocumentSchema);

export const DocumentAccessLog =
  mongoose.models.DocumentAccessLog ||
  mongoose.model('DocumentAccessLog', DocumentAccessLogSchema);

export const DocumentTemplate =
  mongoose.models.DocumentTemplate ||
  mongoose.model('DocumentTemplate', DocumentTemplateSchema);

export async function uploadDocument(
  fileName: string,
  fileType: string,
  fileSize: number,
  fileUrl: string,
  entityType: string,
  entityId: string,
  documentType: string,
  uploadedBy: string,
  metadata?: any
) {
  try {
    const documentId = `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const document = new Document({
      documentId,
      fileName,
      fileType,
      fileSize,
      fileUrl,
      entityType,
      entityId,
      documentType,
      uploadedBy,
      metadata: metadata || {},
    });

    await document.save();

    await createAuditLog({
      action: 'UPLOAD_DOCUMENT',
      entityType: 'Document',
      entityId: documentId,
      changes: { fileName, documentType },
      userId: uploadedBy,
    });

    return { success: true, documentId, document };
  } catch (error) {
    console.error('Error uploading document:', error);
    return { success: false, error: 'Failed to upload document' };
  }
}

export async function getDocuments(
  entityType: string,
  entityId: string,
  documentType?: string
) {
  try {
    const query: any = { entityType, entityId, isActive: true };
    if (documentType) query.documentType = documentType;

    const documents = await Document.find(query)
      .sort({ uploadedAt: -1 })
      .lean();

    return { success: true, documents };
  } catch (error) {
    console.error('Error fetching documents:', error);
    return { success: false, error: 'Failed to fetch documents' };
  }
}

export async function logDocumentAccess(
  documentId: string,
  accessedBy: string,
  accessType: 'view' | 'download' | 'share' | 'delete',
  ipAddress?: string,
  userAgent?: string
) {
  try {
    const logId = `DAL-${Date.now()}`;

    const log = new DocumentAccessLog({
      logId,
      documentId,
      accessedBy,
      accessType,
      ipAddress,
      userAgent,
    });

    await log.save();

    return { success: true, logId };
  } catch (error) {
    console.error('Error logging document access:', error);
    return { success: false, error: 'Failed to log access' };
  }
}

export async function getDocumentAccessLogs(
  documentId: string,
  limit: number = 50
) {
  try {
    const logs = await DocumentAccessLog.find({ documentId })
      .sort({ accessedAt: -1 })
      .limit(limit)
      .lean();

    return { success: true, logs };
  } catch (error) {
    console.error('Error fetching access logs:', error);
    return { success: false, error: 'Failed to fetch logs' };
  }
}

export async function createDocumentVersion(
  documentId: string,
  newFileUrl: string,
  uploadedBy: string
) {
  try {
    const document = await Document.findOne({ documentId });
    if (!document) {
      return { success: false, error: 'Document not found' };
    }

    document.version += 1;
    document.fileUrl = newFileUrl;
    document.updatedAt = new Date();

    await document.save();

    await createAuditLog({
      action: 'UPDATE_DOCUMENT_VERSION',
      entityType: 'Document',
      entityId: documentId,
      changes: { version: document.version },
      userId: uploadedBy,
    });

    return { success: true, document };
  } catch (error) {
    console.error('Error creating document version:', error);
    return { success: false, error: 'Failed to create version' };
  }
}

export async function deleteDocument(documentId: string, deletedBy: string) {
  try {
    const document = await Document.findOne({ documentId });
    if (!document) {
      return { success: false, error: 'Document not found' };
    }

    document.isActive = false;
    await document.save();

    await createAuditLog({
      action: 'DELETE_DOCUMENT',
      entityType: 'Document',
      entityId: documentId,
      changes: { isActive: false },
      userId: deletedBy,
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting document:', error);
    return { success: false, error: 'Failed to delete document' };
  }
}
