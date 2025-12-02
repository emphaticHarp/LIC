import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'sales';
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const agentId = searchParams.get('agentId') || undefined;

    let report: any = {};

    switch (reportType) {
      case 'sales':
        report = await generateSalesReport(startDate, endDate, agentId);
        break;
      case 'claims':
        report = await generateClaimsReport(startDate, endDate);
        break;
      case 'revenue':
        report = await generateRevenueReport(startDate, endDate);
        break;
      case 'agent_performance':
        report = await generateAgentPerformanceReport(startDate, endDate);
        break;
      case 'customer_analytics':
        report = await generateCustomerAnalyticsReport();
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid report type' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: report,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function generateSalesReport(
  startDate?: string,
  endDate?: string,
  agentId?: string
) {
  const db = mongoose.connection;

  const matchStage: any = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }
  if (agentId) matchStage.agentId = new mongoose.Types.ObjectId(agentId);

  const policies = db.collection('policies');

  const report = await policies
    .aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$agentId',
          totalPolicies: { $sum: 1 },
          totalPremium: { $sum: '$premium' },
          avgPremium: { $avg: '$premium' },
        },
      },
      { $sort: { totalPremium: -1 } },
    ])
    .toArray();

  return {
    type: 'sales',
    period: { startDate, endDate },
    summary: {
      totalPolicies: report.reduce((sum, r) => sum + r.totalPolicies, 0),
      totalPremium: report.reduce((sum, r) => sum + r.totalPremium, 0),
    },
    details: report,
  };
}

async function generateClaimsReport(startDate?: string, endDate?: string) {
  const db = mongoose.connection;

  const matchStage: any = {};
  if (startDate || endDate) {
    matchStage.submittedDate = {};
    if (startDate) matchStage.submittedDate.$gte = new Date(startDate);
    if (endDate) matchStage.submittedDate.$lte = new Date(endDate);
  }

  const claims = db.collection('claims');

  const report = await claims
    .aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$claimAmount' },
        },
      },
    ])
    .toArray();

  return {
    type: 'claims',
    period: { startDate, endDate },
    summary: {
      totalClaims: report.reduce((sum, r) => sum + r.count, 0),
      totalClaimAmount: report.reduce((sum, r) => sum + r.totalAmount, 0),
    },
    byStatus: report,
  };
}

async function generateRevenueReport(startDate?: string, endDate?: string) {
  const db = mongoose.connection;

  const matchStage: any = { status: 'completed' };
  if (startDate || endDate) {
    matchStage.paymentDate = {};
    if (startDate) matchStage.paymentDate.$gte = new Date(startDate);
    if (endDate) matchStage.paymentDate.$lte = new Date(endDate);
  }

  const payments = db.collection('payments');

  const report = await payments
    .aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
        },
      },
    ])
    .toArray();

  return {
    type: 'revenue',
    period: { startDate, endDate },
    summary: {
      totalTransactions: report.reduce((sum, r) => sum + r.count, 0),
      totalRevenue: report.reduce((sum, r) => sum + r.totalAmount, 0),
    },
    byPaymentMethod: report,
  };
}

async function generateAgentPerformanceReport(
  startDate?: string,
  endDate?: string
) {
  const db = mongoose.connection;

  const matchStage: any = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const policies = db.collection('policies');

  const report = await policies
    .aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$agentId',
          policiesSold: { $sum: 1 },
          totalPremium: { $sum: '$premium' },
          avgPremium: { $avg: '$premium' },
        },
      },
      { $sort: { totalPremium: -1 } },
      { $limit: 10 },
    ])
    .toArray();

  return {
    type: 'agent_performance',
    period: { startDate, endDate },
    topAgents: report,
  };
}

async function generateCustomerAnalyticsReport() {
  const db = mongoose.connection;

  const customers = db.collection('customers');

  const totalCustomers = await customers.countDocuments();
  const activeCustomers = await customers.countDocuments({ status: 'active' });
  const kycVerified = await customers.countDocuments({
    kycStatus: 'verified',
  });

  return {
    type: 'customer_analytics',
    summary: {
      totalCustomers,
      activeCustomers,
      kycVerified,
      conversionRate: ((kycVerified / totalCustomers) * 100).toFixed(2) + '%',
    },
  };
}
