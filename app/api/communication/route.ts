import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  CommunicationTemplate,
  CommunicationLog,
  sendEmail,
  sendSMS,
  sendWhatsApp,
  interpolateTemplate,
} from '@/lib/communication';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action') || 'templates';
    const type = searchParams.get('type');

    if (action === 'templates') {
      const query: any = {};
      if (type) query.type = type;

      const templates = await CommunicationTemplate.find(query).lean();
      return NextResponse.json({ success: true, data: templates });
    }

    if (action === 'logs') {
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '20');
      const skip = (page - 1) * limit;

      const logs = await CommunicationLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await CommunicationLog.countDocuments();

      return NextResponse.json({
        success: true,
        data: logs,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching communication data:', error);
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
    const { action, templateId, recipientId, recipientEmail, recipientPhone, type, variables } = body;

    if (action === 'send') {
      if (!type || !recipientId) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      // Get template
      const template = await CommunicationTemplate.findOne({ templateId });
      if (!template) {
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        );
      }

      // Interpolate variables
      const content = interpolateTemplate(template.body, variables || {});

      let result;
      switch (type) {
        case 'email':
          if (!recipientEmail) {
            return NextResponse.json(
              { success: false, error: 'Email address required' },
              { status: 400 }
            );
          }
          result = await sendEmail(
            recipientEmail,
            template.subject,
            content,
            templateId
          );
          break;

        case 'sms':
          if (!recipientPhone) {
            return NextResponse.json(
              { success: false, error: 'Phone number required' },
              { status: 400 }
            );
          }
          result = await sendSMS(recipientPhone, content, templateId);
          break;

        case 'whatsapp':
          if (!recipientPhone) {
            return NextResponse.json(
              { success: false, error: 'Phone number required' },
              { status: 400 }
            );
          }
          result = await sendWhatsApp(recipientPhone, content, templateId);
          break;

        default:
          return NextResponse.json(
            { success: false, error: 'Invalid communication type' },
            { status: 400 }
          );
      }

      return NextResponse.json({ success: true, data: result });
    }

    if (action === 'create_template') {
      const { name, type: templateType, subject, body: messageBody, variables: vars } = body;

      if (!name || !templateType || !messageBody) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields' },
          { status: 400 }
        );
      }

      const templateId = `TPL-${Date.now()}`;
      const template = new CommunicationTemplate({
        templateId,
        name,
        type: templateType,
        subject,
        body: messageBody,
        variables: vars || [],
      });

      await template.save();

      return NextResponse.json(
        { success: true, data: template },
        { status: 201 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error processing communication request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
