import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';

// Simple in-memory audit log storage (in production, use MongoDB)
let auditLogs: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const { user, action, entity, entityId, changes, ipAddress, status } = await request.json();

    if (!user || !action || !entity) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const auditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user,
      action,
      entity,
      entityId,
      changes,
      ipAddress: ipAddress || 'unknown',
      status: status || 'success',
    };

    auditLogs.push(auditLog);

    // Keep only last 1000 logs in memory
    if (auditLogs.length > 1000) {
      auditLogs = auditLogs.slice(-1000);
    }

    return NextResponse.json(
      { success: true, log: auditLog },
      { status: 201 }
    );
  } catch (error) {
    console.error('Audit log error:', error);
    return NextResponse.json(
      { error: 'Failed to create audit log' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const entity = searchParams.get('entity');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filtered = [...auditLogs];

    if (action) {
      filtered = filtered.filter(log => log.action === action);
    }

    if (entity) {
      filtered = filtered.filter(log => log.entity === entity);
    }

    if (status) {
      filtered = filtered.filter(log => log.status === status);
    }

    // Return most recent logs first
    const results = filtered.reverse().slice(0, limit);

    return NextResponse.json(
      { success: true, data: results, total: filtered.length },
      { status: 200 }
    );
  } catch (error) {
    console.error('Audit log retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve audit logs' },
      { status: 500 }
    );
  }
}
