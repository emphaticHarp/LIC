import { NextRequest, NextResponse } from 'next/server';

// In-memory lapse alerts storage
let lapseAlerts: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { policyId, customerEmail, premiumDueDate, premiumAmount } = body;

    if (!policyId || !customerEmail || !premiumDueDate) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate days until lapse
    const dueDate = new Date(premiumDueDate);
    const today = new Date();
    const daysUntilLapse = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Determine risk level
    let riskLevel = 'low';
    if (daysUntilLapse <= 7) riskLevel = 'critical';
    else if (daysUntilLapse <= 15) riskLevel = 'high';
    else if (daysUntilLapse <= 30) riskLevel = 'medium';

    const alert = {
      id: `LAPSE-${Date.now()}`,
      policyId,
      customerEmail,
      premiumDueDate,
      premiumAmount,
      daysUntilLapse,
      riskLevel,
      createdAt: new Date().toISOString(),
      communicationSent: false,
      communicationMethods: [],
    };

    lapseAlerts.push(alert);

    return NextResponse.json(
      { success: true, data: alert },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lapse alert error:', error);
    return NextResponse.json(
      { error: 'Failed to create lapse alert' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const riskLevel = searchParams.get('riskLevel');
    const policyId = searchParams.get('policyId');

    let filtered = [...lapseAlerts];

    if (riskLevel) {
      filtered = filtered.filter(alert => alert.riskLevel === riskLevel);
    }

    if (policyId) {
      filtered = filtered.filter(alert => alert.policyId === policyId);
    }

    // Sort by risk level (critical first)
    const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    filtered.sort((a, b) => riskOrder[a.riskLevel as keyof typeof riskOrder] - riskOrder[b.riskLevel as keyof typeof riskOrder]);

    return NextResponse.json(
      { success: true, data: filtered },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lapse alert retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve lapse alerts' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, communicationSent, communicationMethods } = body;

    const alertIndex = lapseAlerts.findIndex(alert => alert.id === id);

    if (alertIndex === -1) {
      return NextResponse.json(
        { error: 'Lapse alert not found' },
        { status: 404 }
      );
    }

    if (communicationSent !== undefined) lapseAlerts[alertIndex].communicationSent = communicationSent;
    if (communicationMethods) lapseAlerts[alertIndex].communicationMethods = communicationMethods;

    return NextResponse.json(
      { success: true, data: lapseAlerts[alertIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Lapse alert update error:', error);
    return NextResponse.json(
      { error: 'Failed to update lapse alert' },
      { status: 500 }
    );
  }
}
