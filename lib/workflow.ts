import mongoose from 'mongoose';
import { createAuditLog } from './audit';

const WorkflowSchema = new mongoose.Schema(
  {
    workflowId: { type: String, unique: true },
    name: String,
    type: {
      type: String,
      enum: [
        'claim_approval',
        'policy_renewal',
        'payment_reminder',
        'kyc_verification',
      ],
    },
    triggers: mongoose.Schema.Types.Mixed,
    actions: [mongoose.Schema.Types.Mixed],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const WorkflowExecutionSchema = new mongoose.Schema(
  {
    executionId: { type: String, unique: true },
    workflowId: String,
    entityType: String,
    entityId: String,
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'failed'],
      default: 'pending',
    },
    result: mongoose.Schema.Types.Mixed,
    error: String,
    startedAt: Date,
    completedAt: Date,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Workflow =
  mongoose.models.Workflow || mongoose.model('Workflow', WorkflowSchema);

export const WorkflowExecution =
  mongoose.models.WorkflowExecution ||
  mongoose.model('WorkflowExecution', WorkflowExecutionSchema);

export async function triggerWorkflow(
  workflowId: string,
  entityType: string,
  entityId: string,
  data: any
) {
  try {
    const workflow = await Workflow.findOne({ workflowId });
    if (!workflow || !workflow.isActive) {
      return { success: false, error: 'Workflow not found or inactive' };
    }

    const executionId = `WFX-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const execution = new WorkflowExecution({
      executionId,
      workflowId,
      entityType,
      entityId,
      status: 'pending',
      startedAt: new Date(),
    });

    await execution.save();

    // Execute workflow actions
    const result = await executeWorkflowActions(workflow, data, execution);

    execution.status = result.success ? 'completed' : 'failed';
    execution.result = result;
    execution.completedAt = new Date();

    if (!result.success) {
      execution.error = result.error;
    }

    await execution.save();

    await createAuditLog({
      action: 'WORKFLOW_EXECUTED',
      entityType: 'Workflow',
      entityId: workflowId,
      changes: { executionId, status: execution.status },
      userId: 'system',
    });

    return { success: true, executionId, result };
  } catch (error) {
    console.error('Error triggering workflow:', error);
    return { success: false, error: 'Failed to trigger workflow' };
  }
}

async function executeWorkflowActions(
  workflow: any,
  data: any,
  execution: any
) {
  try {
    const results: any[] = [];

    for (const action of workflow.actions) {
      const actionResult = await executeAction(action, data);
      results.push(actionResult);

      if (!actionResult.success) {
        return { success: false, error: (actionResult as any).error || 'Action failed', results };
      }
    }

    return { success: true, results };
  } catch (error) {
    console.error('Error executing workflow actions:', error);
    return { success: false, error: 'Failed to execute actions' };
  }
}

async function executeAction(action: any, data: any) {
  try {
    switch (action.type) {
      case 'send_notification':
        return await sendNotificationAction(action, data);

      case 'update_status':
        return await updateStatusAction(action, data);

      case 'send_email':
        return await sendEmailAction(action, data);

      case 'create_task':
        return await createTaskAction(action, data);

      default:
        return { success: false, error: `Unknown action type: ${action.type}` };
    }
  } catch (error) {
    console.error('Error executing action:', error);
    return { success: false, error: 'Action execution failed' };
  }
}

async function sendNotificationAction(action: any, data: any) {
  // TODO: Implement notification sending
  console.log('Sending notification:', action, data);
  return { success: true, message: 'Notification sent' };
}

async function updateStatusAction(action: any, data: any) {
  // TODO: Implement status update
  console.log('Updating status:', action, data);
  return { success: true, message: 'Status updated' };
}

async function sendEmailAction(action: any, data: any) {
  // TODO: Implement email sending
  console.log('Sending email:', action, data);
  return { success: true, message: 'Email sent' };
}

async function createTaskAction(action: any, data: any) {
  // TODO: Implement task creation
  console.log('Creating task:', action, data);
  return { success: true, message: 'Task created' };
}

// Predefined workflows
export const PREDEFINED_WORKFLOWS = {
  CLAIM_APPROVAL: {
    name: 'Automatic Claim Approval',
    type: 'claim_approval',
    triggers: {
      claimAmount: { $lte: 50000 },
      claimType: 'cashless',
    },
    actions: [
      {
        type: 'update_status',
        target: 'claim',
        newStatus: 'approved',
      },
      {
        type: 'send_notification',
        recipient: 'customer',
        message: 'Your claim has been approved',
      },
      {
        type: 'send_email',
        template: 'claim_approved',
      },
    ],
  },

  POLICY_RENEWAL_REMINDER: {
    name: 'Policy Renewal Reminder',
    type: 'policy_renewal',
    triggers: {
      daysUntilExpiry: { $lte: 30 },
    },
    actions: [
      {
        type: 'send_notification',
        recipient: 'customer',
        message: 'Your policy is expiring soon. Please renew it.',
      },
      {
        type: 'send_email',
        template: 'renewal_reminder',
      },
      {
        type: 'send_sms',
        template: 'renewal_reminder_sms',
      },
    ],
  },

  PAYMENT_REMINDER: {
    name: 'Payment Due Reminder',
    type: 'payment_reminder',
    triggers: {
      daysUntilDue: { $lte: 5 },
      status: 'pending',
    },
    actions: [
      {
        type: 'send_notification',
        recipient: 'customer',
        message: 'Your payment is due soon',
      },
      {
        type: 'send_sms',
        template: 'payment_reminder',
      },
    ],
  },
};
