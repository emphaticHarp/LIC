// Automated Workflow Engine
// Handles business process automation

import { connectDB } from './db';
import mongoose from 'mongoose';

const WorkflowSchema = new mongoose.Schema(
  {
    name: String,
    trigger: {
      type: String,
      enum: ['policy_created', 'premium_due', 'claim_submitted', 'payment_received', 'policy_expiring', 'custom'],
    },
    conditions: mongoose.Schema.Types.Mixed,
    actions: [{
      type: {
        type: String,
        enum: ['send_email', 'send_sms', 'create_notification', 'update_status', 'create_task', 'webhook'],
      },
      config: mongoose.Schema.Types.Mixed,
    }],
    enabled: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Workflow = mongoose.models.Workflow || mongoose.model('Workflow', WorkflowSchema);

interface WorkflowContext {
  customerId?: string;
  policyId?: string;
  claimId?: string;
  paymentId?: string;
  customerEmail?: string;
  customerName?: string;
  [key: string]: any;
}

export async function executeWorkflows(trigger: string, context: WorkflowContext) {
  try {
    await connectDB();

    const workflows = await Workflow.find({
      trigger,
      enabled: true,
    });

    for (const workflow of workflows) {
      // Check conditions
      if (workflow.conditions && !evaluateConditions(workflow.conditions, context)) {
        continue;
      }

      // Execute actions
      for (const action of workflow.actions) {
        await executeAction(action, context);
      }
    }
  } catch (error) {
    console.error('Error executing workflows:', error);
  }
}

function evaluateConditions(conditions: any, context: WorkflowContext): boolean {
  // Simple condition evaluation
  // In production, use a more robust rule engine
  if (!conditions || Object.keys(conditions).length === 0) {
    return true;
  }

  // Example: { field: 'amount', operator: '>', value: 10000 }
  if (conditions.field && conditions.operator && conditions.value !== undefined) {
    const fieldValue = context[conditions.field];
    switch (conditions.operator) {
      case '>':
        return fieldValue > conditions.value;
      case '<':
        return fieldValue < conditions.value;
      case '>=':
        return fieldValue >= conditions.value;
      case '<=':
        return fieldValue <= conditions.value;
      case '==':
        return fieldValue === conditions.value;
      case '!=':
        return fieldValue !== conditions.value;
      default:
        return true;
    }
  }

  return true;
}

async function executeAction(action: any, context: WorkflowContext) {
  try {
    switch (action.type) {
      case 'send_email':
        await sendEmail(action.config, context);
        break;
      case 'send_sms':
        await sendSMS(action.config, context);
        break;
      case 'create_notification':
        await createNotification(action.config, context);
        break;
      case 'update_status':
        await updateStatus(action.config, context);
        break;
      case 'create_task':
        await createTask(action.config, context);
        break;
      case 'webhook':
        await callWebhook(action.config, context);
        break;
    }
  } catch (error) {
    console.error(`Error executing action ${action.type}:`, error);
  }
}

async function sendEmail(config: any, context: WorkflowContext) {
  const emailData = {
    to: context.customerEmail || config.to,
    subject: replacePlaceholders(config.subject || 'Notification', context),
    html: replacePlaceholders(config.html || config.template || '', context),
  };

  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData),
  });
}

async function sendSMS(config: any, context: WorkflowContext) {
  // Implement SMS sending (Twilio, etc.)
  console.log('📱 SMS:', {
    to: context.customerPhone || config.to,
    message: replacePlaceholders(config.message || '', context),
  });
}

async function createNotification(config: any, context: WorkflowContext) {
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: context.customerEmail,
      userId: context.customerId,
      title: replacePlaceholders(config.title || 'Notification', context),
      message: replacePlaceholders(config.message || '', context),
      type: config.type || 'info',
      link: config.link ? replacePlaceholders(config.link, context) : undefined,
    }),
  });
}

async function updateStatus(config: any, context: WorkflowContext) {
  // Update entity status in database
  const { entityType, entityId, status } = config;
  
  if (entityType === 'policy' && context.policyId) {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/policies`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        policyId: context.policyId,
        status: status,
      }),
    });
  }
  // Add more entity types as needed
}

async function createTask(config: any, context: WorkflowContext) {
  // Create a task in task management system
  console.log('📋 Task Created:', {
    title: replacePlaceholders(config.title || 'Task', context),
    description: replacePlaceholders(config.description || '', context),
    assignee: config.assignee,
  });
}

async function callWebhook(config: any, context: WorkflowContext) {
  await fetch(config.url, {
    method: config.method || 'POST',
    headers: config.headers || { 'Content-Type': 'application/json' },
    body: JSON.stringify(context),
  });
}

function replacePlaceholders(template: string, context: WorkflowContext): string {
  let result = template;
  for (const [key, value] of Object.entries(context)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value || ''));
  }
  return result;
}

// Predefined workflows
export const defaultWorkflows = [
  {
    name: 'Policy Created - Welcome Email',
    trigger: 'policy_created',
    conditions: {},
    actions: [
      {
        type: 'send_email',
        config: {
          subject: 'Welcome! Your Policy {{policyId}} has been Created',
          html: '<p>Dear {{customerName}},</p><p>Your policy {{policyId}} has been created successfully.</p>',
        },
      },
      {
        type: 'create_notification',
        config: {
          title: 'Policy Created',
          message: 'Policy {{policyId}} has been created',
          type: 'success',
        },
      },
    ],
  },
  {
    name: 'Premium Due Reminder',
    trigger: 'premium_due',
    conditions: {},
    actions: [
      {
        type: 'send_email',
        config: {
          subject: 'Premium Payment Reminder - Policy {{policyId}}',
          html: '<p>Dear {{customerName}},</p><p>Your premium payment is due soon.</p>',
        },
      },
      {
        type: 'create_notification',
        config: {
          title: 'Premium Due',
          message: 'Premium payment due for policy {{policyId}}',
          type: 'warning',
        },
      },
    ],
  },
  {
    name: 'Claim Submitted - Acknowledgment',
    trigger: 'claim_submitted',
    conditions: {},
    actions: [
      {
        type: 'send_email',
        config: {
          subject: 'Claim {{claimId}} Received',
          html: '<p>Dear {{customerName}},</p><p>We have received your claim {{claimId}} and it is under review.</p>',
        },
      },
      {
        type: 'create_notification',
        config: {
          title: 'Claim Submitted',
          message: 'Claim {{claimId}} has been submitted',
          type: 'info',
        },
      },
    ],
  },
  {
    name: 'Payment Received - Confirmation',
    trigger: 'payment_received',
    conditions: {},
    actions: [
      {
        type: 'send_email',
        config: {
          subject: 'Payment Received - ₹{{amount}}',
          html: '<p>Dear {{customerName}},</p><p>We have received your payment of ₹{{amount}}.</p>',
        },
      },
      {
        type: 'create_notification',
        config: {
          title: 'Payment Received',
          message: 'Payment of ₹{{amount}} received',
          type: 'success',
        },
      },
    ],
  },
];

