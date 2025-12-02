import mongoose from 'mongoose';

const CommunicationTemplateSchema = new mongoose.Schema(
  {
    templateId: { type: String, unique: true },
    name: String,
    type: {
      type: String,
      enum: ['email', 'sms', 'whatsapp'],
    },
    subject: String,
    body: String,
    variables: [String], // e.g., {{customerName}}, {{policyNumber}}
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const CommunicationLogSchema = new mongoose.Schema(
  {
    logId: { type: String, unique: true },
    templateId: String,
    recipientId: mongoose.Schema.Types.ObjectId,
    recipientEmail: String,
    recipientPhone: String,
    type: String,
    status: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'delivered'],
      default: 'pending',
    },
    content: String,
    sentAt: Date,
    deliveredAt: Date,
    failureReason: String,
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const CommunicationTemplate =
  mongoose.models.CommunicationTemplate ||
  mongoose.model('CommunicationTemplate', CommunicationTemplateSchema);

export const CommunicationLog =
  mongoose.models.CommunicationLog ||
  mongoose.model('CommunicationLog', CommunicationLogSchema);

export async function sendEmail(
  to: string,
  subject: string,
  body: string,
  templateId?: string
) {
  // Integration with email service (SendGrid, Mailgun, etc.)
  const logId = `EMAIL-${Date.now()}`;

  try {
    // TODO: Implement actual email sending
    console.log(`Sending email to ${to}: ${subject}`);

    const log = new CommunicationLog({
      logId,
      templateId,
      recipientEmail: to,
      type: 'email',
      status: 'sent',
      content: body,
      sentAt: new Date(),
    });

    await log.save();
    return { success: true, logId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: 'Failed to send email' };
  }
}

export async function sendSMS(
  phone: string,
  message: string,
  templateId?: string
) {
  // Integration with SMS service (Twilio, AWS SNS, etc.)
  const logId = `SMS-${Date.now()}`;

  try {
    // TODO: Implement actual SMS sending
    console.log(`Sending SMS to ${phone}: ${message}`);

    const log = new CommunicationLog({
      logId,
      templateId,
      recipientPhone: phone,
      type: 'sms',
      status: 'sent',
      content: message,
      sentAt: new Date(),
    });

    await log.save();
    return { success: true, logId };
  } catch (error) {
    console.error('Error sending SMS:', error);
    return { success: false, error: 'Failed to send SMS' };
  }
}

export async function sendWhatsApp(
  phone: string,
  message: string,
  templateId?: string
) {
  // Integration with WhatsApp Business API
  const logId = `WA-${Date.now()}`;

  try {
    // TODO: Implement actual WhatsApp sending
    console.log(`Sending WhatsApp to ${phone}: ${message}`);

    const log = new CommunicationLog({
      logId,
      templateId,
      recipientPhone: phone,
      type: 'whatsapp',
      status: 'sent',
      content: message,
      sentAt: new Date(),
    });

    await log.save();
    return { success: true, logId };
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return { success: false, error: 'Failed to send WhatsApp' };
  }
}

export function interpolateTemplate(
  template: string,
  variables: Record<string, any>
): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  });
  return result;
}
