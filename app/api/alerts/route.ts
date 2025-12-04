import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['system', 'security', 'performance', 'maintenance', 'business', 'error'],
      default: 'system',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    title: String,
    message: String,
    source: String, // e.g., 'payment_gateway', 'database', 'api'
    metadata: mongoose.Schema.Types.Mixed,
    acknowledged: { type: Boolean, default: false },
    acknowledgedBy: String,
    acknowledgedAt: Date,
    resolved: { type: Boolean, default: false },
    resolvedAt: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Alert = mongoose.models.Alert || mongoose.model('Alert', AlertSchema);

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const severity = searchParams.get('severity');
    const resolved = searchParams.get('resolved');
    const limit = parseInt(searchParams.get('limit') || '50');

    const query: any = {};
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (resolved !== null) query.resolved = resolved === 'true';

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({ success: true, alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const alert = new Alert({
      type: body.type || 'system',
      severity: body.severity || 'medium',
      title: body.title,
      message: body.message,
      source: body.source,
      metadata: body.metadata,
    });

    await alert.save();

    // Create notification for critical alerts
    if (alert.severity === 'critical' || alert.severity === 'high') {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Alert: ${alert.title}`,
          message: alert.message,
          type: 'error',
          link: `/alerts?id=${alert._id}`,
        }),
      });
    }

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error('Error creating alert:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, acknowledged, resolved, acknowledgedBy } = body;

    const updateData: any = {};
    if (acknowledged !== undefined) {
      updateData.acknowledged = acknowledged;
      if (acknowledged) {
        updateData.acknowledgedBy = acknowledgedBy;
        updateData.acknowledgedAt = new Date();
      }
    }
    if (resolved !== undefined) {
      updateData.resolved = resolved;
      if (resolved) {
        updateData.resolvedAt = new Date();
      }
    }

    const alert = await Alert.findByIdAndUpdate(id, updateData, { new: true });

    if (!alert) {
      return NextResponse.json({ success: false, error: 'Alert not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, alert });
  } catch (error) {
    console.error('Error updating alert:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

