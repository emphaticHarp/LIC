import mongoose from 'mongoose';

// Sales Pipeline (Kanban Board)
const LeadSchema = new mongoose.Schema(
  {
    leadId: { type: String, unique: true },
    agentId: mongoose.Schema.Types.ObjectId,
    customerName: String,
    email: String,
    phone: String,
    stage: {
      type: String,
      enum: ['prospect', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed'],
      default: 'prospect',
    },
    value: Number,
    probability: { type: Number, default: 0 },
    expectedCloseDate: Date,
    notes: String,
    lastContactDate: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Task Management
const TaskSchema = new mongoose.Schema(
  {
    taskId: { type: String, unique: true },
    agentId: mongoose.Schema.Types.ObjectId,
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed', 'cancelled'],
      default: 'todo',
    },
    dueDate: Date,
    relatedTo: {
      type: String,
      entityType: String,
      entityId: mongoose.Schema.Types.ObjectId,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Quick Quote Generator
const QuoteSchema = new mongoose.Schema(
  {
    quoteId: { type: String, unique: true },
    agentId: mongoose.Schema.Types.ObjectId,
    customerId: mongoose.Schema.Types.ObjectId,
    policyType: String,
    coverage: Number,
    term: Number,
    premium: Number,
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected', 'expired'],
      default: 'draft',
    },
    validUntil: Date,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Proposal Builder
const ProposalSchema = new mongoose.Schema(
  {
    proposalId: { type: String, unique: true },
    agentId: mongoose.Schema.Types.ObjectId,
    customerId: mongoose.Schema.Types.ObjectId,
    title: String,
    content: String,
    items: [
      {
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
      },
    ],
    totalAmount: Number,
    validUntil: Date,
    status: {
      type: String,
      enum: ['draft', 'sent', 'accepted', 'rejected'],
      default: 'draft',
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Lead =
  mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

export const Task =
  mongoose.models.Task || mongoose.model('Task', TaskSchema);

export const Quote =
  mongoose.models.Quote || mongoose.model('Quote', QuoteSchema);

export const Proposal =
  mongoose.models.Proposal || mongoose.model('Proposal', ProposalSchema);

// Lead Management Functions
export async function createLead(
  agentId: string,
  customerName: string,
  email: string,
  phone: string,
  value: number
) {
  try {
    const leadId = `LEAD-${Date.now()}`;

    const lead = new Lead({
      leadId,
      agentId,
      customerName,
      email,
      phone,
      value,
      stage: 'prospect',
    });

    await lead.save();
    return { success: true, leadId, lead };
  } catch (error) {
    console.error('Error creating lead:', error);
    return { success: false, error: 'Failed to create lead' };
  }
}

export async function updateLeadStage(leadId: string, newStage: string) {
  try {
    const lead = await Lead.findOneAndUpdate(
      { leadId },
      { stage: newStage, updatedAt: new Date() },
      { new: true }
    );

    if (!lead) {
      return { success: false, error: 'Lead not found' };
    }

    return { success: true, lead };
  } catch (error) {
    console.error('Error updating lead stage:', error);
    return { success: false, error: 'Failed to update lead' };
  }
}

export async function getAgentLeads(agentId: string) {
  try {
    const leads = await Lead.find({ agentId }).sort({ createdAt: -1 }).lean();

    const pipeline = {
      prospect: leads.filter((l) => l.stage === 'prospect').length,
      contacted: leads.filter((l) => l.stage === 'contacted').length,
      qualified: leads.filter((l) => l.stage === 'qualified').length,
      proposal: leads.filter((l) => l.stage === 'proposal').length,
      negotiation: leads.filter((l) => l.stage === 'negotiation').length,
      closed: leads.filter((l) => l.stage === 'closed').length,
    };

    const totalValue = leads.reduce((sum, l) => sum + (l.value || 0), 0);

    return {
      success: true,
      leads,
      pipeline,
      totalValue,
    };
  } catch (error) {
    console.error('Error fetching agent leads:', error);
    return { success: false, error: 'Failed to fetch leads' };
  }
}

// Task Management Functions
export async function createTask(
  agentId: string,
  title: string,
  description: string,
  dueDate: Date,
  priority: string = 'medium'
) {
  try {
    const taskId = `TASK-${Date.now()}`;

    const task = new Task({
      taskId,
      agentId,
      title,
      description,
      dueDate,
      priority,
      status: 'todo',
    });

    await task.save();
    return { success: true, taskId, task };
  } catch (error) {
    console.error('Error creating task:', error);
    return { success: false, error: 'Failed to create task' };
  }
}

export async function getAgentTasks(agentId: string) {
  try {
    const tasks = await Task.find({ agentId })
      .sort({ dueDate: 1 })
      .lean();

    const byStatus = {
      todo: tasks.filter((t) => t.status === 'todo').length,
      in_progress: tasks.filter((t) => t.status === 'in_progress').length,
      completed: tasks.filter((t) => t.status === 'completed').length,
    };

    const overdue = tasks.filter(
      (t) => t.dueDate < new Date() && t.status !== 'completed'
    ).length;

    return {
      success: true,
      tasks,
      byStatus,
      overdue,
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return { success: false, error: 'Failed to fetch tasks' };
  }
}

// Quick Quote Generator
export async function generateQuote(
  agentId: string,
  customerId: string,
  policyType: string,
  coverage: number,
  term: number
) {
  try {
    // Simple premium calculation (can be enhanced)
    const baseRate = 0.5; // 0.5% of coverage per year
    const premium = (coverage * baseRate * term) / 100;

    const quoteId = `QUOTE-${Date.now()}`;
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const quote = new Quote({
      quoteId,
      agentId,
      customerId,
      policyType,
      coverage,
      term,
      premium: premium.toFixed(2),
      validUntil,
      status: 'draft',
    });

    await quote.save();
    return { success: true, quoteId, quote };
  } catch (error) {
    console.error('Error generating quote:', error);
    return { success: false, error: 'Failed to generate quote' };
  }
}

// Proposal Builder
export async function createProposal(
  agentId: string,
  customerId: string,
  title: string,
  items: any[]
) {
  try {
    const proposalId = `PROP-${Date.now()}`;
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const validUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 days

    const proposal = new Proposal({
      proposalId,
      agentId,
      customerId,
      title,
      items,
      totalAmount,
      validUntil,
      status: 'draft',
    });

    await proposal.save();
    return { success: true, proposalId, proposal };
  } catch (error) {
    console.error('Error creating proposal:', error);
    return { success: false, error: 'Failed to create proposal' };
  }
}

// Lead Scoring
export function scoreLeadPriority(lead: any): number {
  let score = 0;

  // Value score (0-40 points)
  if (lead.value > 500000) score += 40;
  else if (lead.value > 250000) score += 30;
  else if (lead.value > 100000) score += 20;
  else score += 10;

  // Stage score (0-30 points)
  const stageScores: any = {
    prospect: 5,
    contacted: 10,
    qualified: 20,
    proposal: 25,
    negotiation: 30,
    closed: 0,
  };
  score += stageScores[lead.stage] || 0;

  // Recency score (0-30 points)
  const daysSinceContact = lead.lastContactDate
    ? Math.floor((Date.now() - lead.lastContactDate.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  if (daysSinceContact <= 7) score += 30;
  else if (daysSinceContact <= 14) score += 20;
  else if (daysSinceContact <= 30) score += 10;

  return Math.min(score, 100);
}
