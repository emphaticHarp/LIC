import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, customers, policies, claims, payments
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query || query.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Query must be at least 2 characters' },
        { status: 400 }
      );
    }

    const searchRegex = { $regex: query, $options: 'i' };
    const results: any = {};

    const db = mongoose.connection;

    if (type === 'all' || type === 'customers') {
      const customers = db.collection('customers');
      results.customers = await customers
        .find({
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { phone: searchRegex },
            { customerId: searchRegex },
            { panNumber: searchRegex },
          ],
        })
        .limit(limit)
        .toArray();
    }

    if (type === 'all' || type === 'policies') {
      const policies = db.collection('policies');
      results.policies = await policies
        .find({
          $or: [
            { policyNumber: searchRegex },
            { policyType: searchRegex },
            { 'customer.name': searchRegex },
          ],
        })
        .limit(limit)
        .toArray();
    }

    if (type === 'all' || type === 'claims') {
      const claims = db.collection('claims');
      results.claims = await claims
        .find({
          $or: [
            { claimId: searchRegex },
            { claimType: searchRegex },
            { description: searchRegex },
          ],
        })
        .limit(limit)
        .toArray();
    }

    if (type === 'all' || type === 'payments') {
      const payments = db.collection('payments');
      results.payments = await payments
        .find({
          $or: [
            { transactionId: searchRegex },
            { receiptNumber: searchRegex },
          ],
        })
        .limit(limit)
        .toArray();
    }

    return NextResponse.json({
      success: true,
      query,
      results,
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
