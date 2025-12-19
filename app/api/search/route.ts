import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase() || '';
    const type = searchParams.get('type') || 'all';
    const status = searchParams.get('status') || 'all';
    const dateRange = searchParams.get('dateRange') || 'all';
    const premiumRange = searchParams.get('premiumRange') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const results: any = {
      customers: [],
      policies: [],
      claims: [],
      payments: [],
      agents: [],
      loans: [],
    };

    // Build search regex for case-insensitive search
    const searchRegex = new RegExp(query, 'i');

    // Search Customers
    if (type === 'all' || type === 'customer') {
      const customerQuery: any = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { customerId: searchRegex },
          { city: searchRegex },
          { panNumber: searchRegex },
        ],
      };

      if (status !== 'all') {
        customerQuery.status = status;
      }

      const customers = await mongoose.connection.collection('customers')
        .find(customerQuery)
        .limit(limit)
        .toArray();

      results.customers = customers.map((c: any) => ({
        _id: c._id,
        type: 'customer',
        title: c.name || 'Unknown Customer',
        subtitle: c.email || c.phone || 'No contact info',
        metadata: `Status: ${c.status || 'N/A'} | KYC: ${c.kycStatus || 'N/A'}`,
        details: c,
      }));
    }

    // Search Policies
    if (type === 'all' || type === 'policy') {
      const policyQuery: any = {
        $or: [
          { policyId: searchRegex },
          { customerName: searchRegex },
          { type: searchRegex },
          { category: searchRegex },
        ],
      };

      if (status !== 'all') {
        policyQuery.status = status;
      }

      // Handle premium range filter
      if (premiumRange !== 'all') {
        const premiumRanges: any = {
          '0-10000': { $gte: 0, $lte: 10000 },
          '10000-50000': { $gte: 10000, $lte: 50000 },
          '50000-100000': { $gte: 50000, $lte: 100000 },
          '100000+': { $gte: 100000 },
        };
        if (premiumRanges[premiumRange]) {
          policyQuery.premium = premiumRanges[premiumRange];
        }
      }

      const policies = await mongoose.connection.collection('policies')
        .find(policyQuery)
        .limit(limit)
        .toArray();

      results.policies = policies.map((p: any) => ({
        _id: p._id,
        type: 'policy',
        title: `Policy ${p.policyId || p._id}`,
        subtitle: p.customerName || 'Unknown Customer',
        metadata: `Type: ${p.type || 'N/A'} | Status: ${p.status || 'N/A'} | Premium: ₹${p.premium || 'N/A'}`,
        details: p,
      }));
    }

    // Search Claims
    if (type === 'all' || type === 'claim') {
      const claimQuery: any = {
        $or: [
          { claimId: searchRegex },
          { claimantName: searchRegex },
          { policyId: searchRegex },
          { claimType: searchRegex },
        ],
      };

      if (status !== 'all') {
        claimQuery.status = status;
      }

      const claims = await mongoose.connection.collection('claims')
        .find(claimQuery)
        .limit(limit)
        .toArray();

      results.claims = claims.map((c: any) => ({
        _id: c._id,
        type: 'claim',
        title: `Claim ${c.claimId || c._id}`,
        subtitle: c.claimantName || 'Unknown',
        metadata: `Amount: ₹${c.amount || 'N/A'} | Status: ${c.status || 'N/A'} | Type: ${c.claimType || 'N/A'}`,
        details: c,
      }));
    }

    // Search Payments
    if (type === 'all' || type === 'payment') {
      const paymentQuery: any = {
        $or: [
          { transactionId: searchRegex },
          { customerName: searchRegex },
          { policyId: searchRegex },
        ],
      };

      if (status !== 'all') {
        paymentQuery.status = status;
      }

      const payments = await mongoose.connection.collection('payments')
        .find(paymentQuery)
        .limit(limit)
        .toArray();

      results.payments = payments.map((p: any) => ({
        _id: p._id,
        type: 'payment',
        title: `Payment ${p.transactionId || p._id}`,
        subtitle: p.customerName || 'Unknown',
        metadata: `Amount: ₹${p.amount || 'N/A'} | Status: ${p.status || 'N/A'} | Method: ${p.method || 'N/A'}`,
        details: p,
      }));
    }

    // Search Agents
    if (type === 'all' || type === 'agent') {
      const agentQuery: any = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { agentId: searchRegex },
        ],
      };

      if (status !== 'all') {
        agentQuery.status = status;
      }

      const agents = await mongoose.connection.collection('agents')
        .find(agentQuery)
        .limit(limit)
        .toArray();

      results.agents = agents.map((a: any) => ({
        _id: a._id,
        type: 'agent',
        title: a.name || 'Unknown Agent',
        subtitle: a.email || a.phone || 'No contact info',
        metadata: `Status: ${a.status || 'N/A'} | Commission: ₹${a.totalCommission || '0'}`,
        details: a,
      }));
    }

    // Search Loans
    if (type === 'all' || type === 'loan') {
      const loanQuery: any = {
        $or: [
          { loanId: searchRegex },
          { fullName: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
        ],
      };

      if (status !== 'all') {
        loanQuery.status = status;
      }

      const loans = await mongoose.connection.collection('loans')
        .find(loanQuery)
        .limit(limit)
        .toArray();

      results.loans = loans.map((l: any) => ({
        _id: l._id,
        type: 'loan',
        title: `Loan ${l.loanId || l._id}`,
        subtitle: l.fullName || 'Unknown',
        metadata: `Amount: ₹${l.loanAmount || 'N/A'} | Status: ${l.status || 'N/A'} | EMI: ₹${l.emi || 'N/A'}`,
        details: l,
      }));
    }

    // Combine all results
    const allResults = [
      ...results.customers,
      ...results.policies,
      ...results.claims,
      ...results.payments,
      ...results.agents,
      ...results.loans,
    ].slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        results,
        allResults,
        total: allResults.length,
        query,
        type,
        status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, query, type, status, dateRange, premiumRange } = body;

    // Save search (in production, save to database)
    const savedSearch = {
      id: `SEARCH-${Date.now()}`,
      name,
      query,
      type,
      status,
      dateRange,
      premiumRange,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, data: savedSearch },
      { status: 201 }
    );
  } catch (error) {
    console.error('Save search error:', error);
    return NextResponse.json(
      { error: 'Failed to save search' },
      { status: 500 }
    );
  }
}
