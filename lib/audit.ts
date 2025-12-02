import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    action: String,
    entityType: String,
    entityId: String,
    userId: String,
    changes: mongoose.Schema.Types.Mixed,
    ipAddress: String,
    userAgent: String,
    status: {
      type: String,
      enum: ['success', 'failed'],
      default: 'success',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const AuditLog =
  mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

export async function createAuditLog(data: {
  action: string;
  entityType: string;
  entityId: string;
  changes: any;
  userId: string;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failed';
  timestamp?: Date;
}) {
  try {
    const auditLog = new AuditLog({
      ...data,
      timestamp: data.timestamp || new Date(),
    });
    await auditLog.save();
    return auditLog;
  } catch (error) {
    console.error('Error creating audit log:', error);
  }
}

export async function getAuditLogs(
  entityType?: string,
  entityId?: string,
  limit: number = 50
) {
  try {
    const query: any = {};
    if (entityType) query.entityType = entityType;
    if (entityId) query.entityId = entityId;

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return logs;
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }
}
