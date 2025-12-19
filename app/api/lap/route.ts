import { NextRequest, NextResponse } from 'next/server';

// In-memory LAP storage (in production, use MongoDB)
let lapApplications: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { policyId, loanAmount, loanTerm, interestRate, bankName, accountNumber, ifscCode } = body;

    if (!policyId || !loanAmount || !loanTerm) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate EMI
    const monthlyRate = interestRate / 12 / 100;
    const monthlyEMI = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, loanTerm)) / 
                       (Math.pow(1 + monthlyRate, loanTerm) - 1);

    const lapApplication = {
      id: `LAP-${Date.now()}`,
      policyId,
      loanAmount,
      loanTerm,
      interestRate,
      monthlyEMI: monthlyEMI.toFixed(2),
      bankName,
      accountNumber,
      ifscCode,
      status: 'approved',
      applicationDate: new Date().toISOString(),
      disbursementDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
      amountDisbursed: 0,
      amountRepaid: 0,
    };

    lapApplications.push(lapApplication);

    return NextResponse.json(
      { success: true, data: lapApplication },
      { status: 201 }
    );
  } catch (error) {
    console.error('LAP application error:', error);
    return NextResponse.json(
      { error: 'Failed to create LAP application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get('policyId');
    const status = searchParams.get('status');

    let filtered = [...lapApplications];

    if (policyId) {
      filtered = filtered.filter(lap => lap.policyId === policyId);
    }

    if (status) {
      filtered = filtered.filter(lap => lap.status === status);
    }

    return NextResponse.json(
      { success: true, data: filtered },
      { status: 200 }
    );
  } catch (error) {
    console.error('LAP retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve LAP applications' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, amountDisbursed, amountRepaid } = body;

    const lapIndex = lapApplications.findIndex(lap => lap.id === id);

    if (lapIndex === -1) {
      return NextResponse.json(
        { error: 'LAP application not found' },
        { status: 404 }
      );
    }

    if (status) lapApplications[lapIndex].status = status;
    if (amountDisbursed !== undefined) lapApplications[lapIndex].amountDisbursed = amountDisbursed;
    if (amountRepaid !== undefined) lapApplications[lapIndex].amountRepaid = amountRepaid;

    return NextResponse.json(
      { success: true, data: lapApplications[lapIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('LAP update error:', error);
    return NextResponse.json(
      { error: 'Failed to update LAP application' },
      { status: 500 }
    );
  }
}
