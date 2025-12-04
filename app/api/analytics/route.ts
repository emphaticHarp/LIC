import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

const Policy = mongoose.models.Policy || mongoose.model('Policy', new mongoose.Schema({}, { strict: false }));
const Customer = mongoose.models.Customer || mongoose.model('Customer', new mongoose.Schema({}, { strict: false }));
const Claim = mongoose.models.Claim || mongoose.model('Claim', new mongoose.Schema({}, { strict: false }));
const Payment = mongoose.models.Payment || mongoose.model('Payment', new mongoose.Schema({}, { strict: false }));

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Get all data
    const [policies, customers, claims, payments] = await Promise.all([
      Policy.find(dateFilter),
      Customer.find(dateFilter),
      Claim.find(dateFilter),
      Payment.find(dateFilter),
    ]);

    // Calculate metrics
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    // Policy metrics
    const totalPolicies = policies.length;
    const activePolicies = policies.filter((p: any) => p.status === 'active').length;
    const policiesThisMonth = policies.filter((p: any) => 
      p.createdAt && new Date(p.createdAt) >= thisMonth
    ).length;
    const totalPremium = policies.reduce((sum: number, p: any) => {
      const premium = parseFloat(String(p.premium || 0).replace(/[^\d.]/g, ''));
      return sum + (isNaN(premium) ? 0 : premium);
    }, 0);

    // Customer metrics
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c: any) => c.status === 'active' || c.status === 'Active').length;
    const customersThisMonth = customers.filter((c: any) =>
      c.createdAt && new Date(c.createdAt) >= thisMonth
    ).length;

    // Claim metrics
    const totalClaims = claims.length;
    const pendingClaims = claims.filter((c: any) => c.status === 'submitted' || c.status === 'under_review').length;
    const approvedClaims = claims.filter((c: any) => c.status === 'approved').length;
    const totalClaimAmount = claims.reduce((sum: number, c: any) => {
      const amount = parseFloat(String(c.claimAmount || 0).replace(/[^\d.]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    // Payment metrics
    const totalPayments = payments.length;
    const completedPayments = payments.filter((p: any) => p.status === 'completed').length;
    const totalPaymentAmount = payments.reduce((sum: number, p: any) => {
      const amount = parseFloat(String(p.amount || 0).replace(/[^\d.]/g, ''));
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    // Revenue trends (last 12 months)
    const revenueTrends = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthPayments = payments.filter((p: any) => {
        const paymentDate = p.paymentDate ? new Date(p.paymentDate) : (p.createdAt ? new Date(p.createdAt) : null);
        return paymentDate && paymentDate >= monthStart && paymentDate <= monthEnd;
      });

      const monthRevenue = monthPayments.reduce((sum: number, p: any) => {
        const amount = parseFloat(String(p.amount || 0).replace(/[^\d.]/g, ''));
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);

      revenueTrends.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        revenue: monthRevenue,
        count: monthPayments.length,
      });
    }

    // Policy type distribution
    const policyTypeDistribution = policies.reduce((acc: any, p: any) => {
      const type = p.type || p.category || 'Other';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // Claim status distribution
    const claimStatusDistribution = claims.reduce((acc: any, c: any) => {
      const status = c.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      analytics: {
        overview: {
          totalPolicies,
          activePolicies,
          policiesThisMonth,
          totalPremium,
          totalCustomers,
          activeCustomers,
          customersThisMonth,
          totalClaims,
          pendingClaims,
          approvedClaims,
          totalClaimAmount,
          totalPayments,
          completedPayments,
          totalPaymentAmount,
        },
        trends: {
          revenue: revenueTrends,
        },
        distributions: {
          policyTypes: policyTypeDistribution,
          claimStatuses: claimStatusDistribution,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

