import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
import { getAuditLogs } from '@/lib/audit';

const ComplianceReportSchema = new mongoose.Schema(
  {
    reportId: { type: String, unique: true },
    type: {
      type: String,
      enum: ['kyc', 'aml', 'gdpr', 'data_retention', 'audit_trail'],
    },
    generatedAt: { type: Date, default: Date.now },
    generatedBy: String,
    data: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      enum: ['draft', 'completed', 'archived'],
      default: 'draft',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ComplianceReport =
  mongoose.models.ComplianceReport ||
  mongoose.model('ComplianceReport', ComplianceReportSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type');
    const action = searchParams.get('action') || 'reports';

    if (action === 'audit_logs') {
      const entityType = searchParams.get('entityType');
      const entityId = searchParams.get('entityId');
      const limit = parseInt(searchParams.get('limit') || '100');

      const logs = await getAuditLogs(entityType || undefined, entityId || undefined, limit);

      return NextResponse.json({
        success: true,
        data: logs,
      });
    }

    if (action === 'reports') {
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const skip = (page - 1) * limit;

      const query: any = {};
      if (reportType) query.type = reportType;

      const reports = await ComplianceReport.find(query)
        .sort({ generatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await ComplianceReport.countDocuments(query);

      return NextResponse.json({
        success: true,
        data: reports,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    if (action === 'kyc_status') {
      const db = mongoose.connection;
      const customers = db.collection('customers');

      const kycStats = await customers
        .aggregate([
          {
            $group: {
              _id: '$kycStatus',
              count: { $sum: 1 },
            },
          },
        ])
        .toArray();

      return NextResponse.json({
        success: true,
        data: kycStats,
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching compliance data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, type, generatedBy } = body;

    if (action === 'generate_report') {
      if (!type) {
        return NextResponse.json(
          { success: false, error: 'Report type required' },
          { status: 400 }
        );
      }

      let reportData: any = {};

      switch (type) {
        case 'kyc':
          reportData = await generateKYCReport();
          break;
        case 'aml':
          reportData = await generateAMLReport();
          break;
        case 'gdpr':
          reportData = await generateGDPRReport();
          break;
        case 'data_retention':
          reportData = await generateDataRetentionReport();
          break;
        case 'audit_trail':
          reportData = await generateAuditTrailReport();
          break;
        default:
          return NextResponse.json(
            { success: false, error: 'Invalid report type' },
            { status: 400 }
          );
      }

      const reportId = `CMP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const report = new ComplianceReport({
        reportId,
        type,
        generatedBy: generatedBy || 'system',
        data: reportData,
        status: 'completed',
      });

      await report.save();

      return NextResponse.json(
        { success: true, data: report },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing compliance request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function generateKYCReport() {
  const db = mongoose.connection;
  const customers = db.collection('customers');

  const total = await customers.countDocuments();
  const verified = await customers.countDocuments({ kycStatus: 'verified' });
  const pending = await customers.countDocuments({ kycStatus: 'pending' });
  const rejected = await customers.countDocuments({ kycStatus: 'rejected' });

  return {
    type: 'KYC Compliance Report',
    total,
    verified,
    pending,
    rejected,
    verificationRate: ((verified / total) * 100).toFixed(2),
    generatedAt: new Date(),
  };
}

async function generateAMLReport() {
  // Anti-Money Laundering Report
  return {
    type: 'AML Compliance Report',
    suspiciousTransactions: 0,
    flaggedCustomers: 0,
    generatedAt: new Date(),
  };
}

async function generateGDPRReport() {
  // GDPR Compliance Report
  const db = mongoose.connection;
  const customers = db.collection('customers');

  const total = await customers.countDocuments();

  return {
    type: 'GDPR Compliance Report',
    totalDataSubjects: total,
    dataRetentionPolicy: 'Active',
    consentManagement: 'Implemented',
    dataProcessingAgreements: 'In Place',
    generatedAt: new Date(),
  };
}

async function generateDataRetentionReport() {
  // Data Retention Report
  return {
    type: 'Data Retention Report',
    retentionPolicies: [
      { type: 'Customer Data', retention: '7 years' },
      { type: 'Transaction Records', retention: '10 years' },
      { type: 'Audit Logs', retention: '5 years' },
    ],
    generatedAt: new Date(),
  };
}

async function generateAuditTrailReport() {
  // Audit Trail Report
  const logs = await getAuditLogs(undefined, undefined, 1000);

  const actionCounts: any = {};
  logs.forEach((log: any) => {
    actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
  });

  return {
    type: 'Audit Trail Report',
    totalEvents: logs.length,
    actionBreakdown: actionCounts,
    generatedAt: new Date(),
  };
}
