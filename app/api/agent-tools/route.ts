import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import {
  createLead,
  updateLeadStage,
  getAgentLeads,
  createTask,
  getAgentTasks,
  generateQuote,
  createProposal,
  scoreLeadPriority,
} from '@/lib/agent-tools';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const tool = searchParams.get('tool') || 'leads';
    const agentId = searchParams.get('agentId');

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'agentId required' },
        { status: 400 }
      );
    }

    if (tool === 'leads') {
      const result = await getAgentLeads(agentId);
      return NextResponse.json(result);
    }

    if (tool === 'tasks') {
      const result = await getAgentTasks(agentId);
      return NextResponse.json(result);
    }

    return NextResponse.json(
      { success: false, error: 'Invalid tool' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in agent tools API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action, agentId } = body;

    if (!agentId) {
      return NextResponse.json(
        { success: false, error: 'agentId required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'create_lead':
        return handleCreateLead(body);

      case 'update_lead_stage':
        return handleUpdateLeadStage(body);

      case 'create_task':
        return handleCreateTask(body);

      case 'generate_quote':
        return handleGenerateQuote(body);

      case 'create_proposal':
        return handleCreateProposal(body);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error processing agent tools request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function handleCreateLead(body: any) {
  const { agentId, customerName, email, phone, value } = body;

  if (!customerName || !email || !phone || !value) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const result = await createLead(agentId, customerName, email, phone, value);
  return NextResponse.json(result, { status: result.success ? 201 : 400 });
}

async function handleUpdateLeadStage(body: any) {
  const { leadId, newStage } = body;

  if (!leadId || !newStage) {
    return NextResponse.json(
      { success: false, error: 'leadId and newStage required' },
      { status: 400 }
    );
  }

  const result = await updateLeadStage(leadId, newStage);
  return NextResponse.json(result);
}

async function handleCreateTask(body: any) {
  const { agentId, title, description, dueDate, priority } = body;

  if (!title || !dueDate) {
    return NextResponse.json(
      { success: false, error: 'title and dueDate required' },
      { status: 400 }
    );
  }

  const result = await createTask(
    agentId,
    title,
    description || '',
    new Date(dueDate),
    priority || 'medium'
  );
  return NextResponse.json(result, { status: result.success ? 201 : 400 });
}

async function handleGenerateQuote(body: any) {
  const { agentId, customerId, policyType, coverage, term } = body;

  if (!customerId || !policyType || !coverage || !term) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const result = await generateQuote(
    agentId,
    customerId,
    policyType,
    coverage,
    term
  );
  return NextResponse.json(result, { status: result.success ? 201 : 400 });
}

async function handleCreateProposal(body: any) {
  const { agentId, customerId, title, items } = body;

  if (!customerId || !title || !items || items.length === 0) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    );
  }

  const result = await createProposal(agentId, customerId, title, items);
  return NextResponse.json(result, { status: result.success ? 201 : 400 });
}
