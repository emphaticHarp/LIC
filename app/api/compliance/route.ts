import { NextRequest, NextResponse } from 'next/server';

// In-memory compliance checklist storage
let complianceChecklists: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { policyId, items } = body;

    if (!policyId) {
      return NextResponse.json(
        { error: 'Policy ID is required' },
        { status: 400 }
      );
    }

    const checklist = {
      id: `COMP-${Date.now()}`,
      policyId,
      items: items || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 0,
    };

    complianceChecklists.push(checklist);

    return NextResponse.json(
      { success: true, data: checklist },
      { status: 201 }
    );
  } catch (error) {
    console.error('Compliance checklist error:', error);
    return NextResponse.json(
      { error: 'Failed to create compliance checklist' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const policyId = searchParams.get('policyId');

    let filtered = [...complianceChecklists];

    if (policyId) {
      filtered = filtered.filter(checklist => checklist.policyId === policyId);
    }

    return NextResponse.json(
      { success: true, data: filtered },
      { status: 200 }
    );
  } catch (error) {
    console.error('Compliance retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve compliance checklists' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, items, completionPercentage } = body;

    const checklistIndex = complianceChecklists.findIndex(c => c.id === id);

    if (checklistIndex === -1) {
      return NextResponse.json(
        { error: 'Compliance checklist not found' },
        { status: 404 }
      );
    }

    if (items) complianceChecklists[checklistIndex].items = items;
    if (completionPercentage !== undefined) complianceChecklists[checklistIndex].completionPercentage = completionPercentage;
    complianceChecklists[checklistIndex].updatedAt = new Date().toISOString();

    return NextResponse.json(
      { success: true, data: complianceChecklists[checklistIndex] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Compliance update error:', error);
    return NextResponse.json(
      { error: 'Failed to update compliance checklist' },
      { status: 500 }
    );
  }
}
