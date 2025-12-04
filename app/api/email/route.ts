import { NextRequest, NextResponse } from 'next/server';

// Email notification system
// Note: For production, integrate with a service like SendGrid, AWS SES, or Nodemailer
// This is a mock implementation that logs emails

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export async function POST(request: NextRequest) {
  try {
    const emailData: EmailData = await request.json();

    // Validate required fields
    if (!emailData.to || !emailData.subject || !emailData.html) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, subject, html' },
        { status: 400 }
      );
    }

    // In production, send email using:
    // - SendGrid: https://sendgrid.com
    // - AWS SES: https://aws.amazon.com/ses/
    // - Nodemailer: https://nodemailer.com
    // - Resend: https://resend.com

    // Mock email sending (logs to console)
    console.log('📧 Email Notification:', {
      to: emailData.to,
      subject: emailData.subject,
      from: emailData.from || 'noreply@lic.com',
      timestamp: new Date().toISOString(),
    });

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // In production, replace with actual email sending:
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    await sgMail.send({
      to: emailData.to,
      from: emailData.from || 'noreply@lic.com',
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text || emailData.html.replace(/<[^>]*>/g, ''),
    });
    */

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      emailId: `email-${Date.now()}`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    );
  }
}

// Email templates
export const emailTemplates = {
  policyCreated: (data: { customerName: string; policyId: string; premium: number }) => ({
    subject: `Policy ${data.policyId} Created Successfully`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Policy Created Successfully</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your policy <strong>${data.policyId}</strong> has been created successfully.</p>
        <p><strong>Premium Amount:</strong> ₹${data.premium.toLocaleString('en-IN')}</p>
        <p>Thank you for choosing LIC.</p>
      </div>
    `,
  }),

  premiumReminder: (data: { customerName: string; policyId: string; dueDate: string; amount: number }) => ({
    subject: `Premium Payment Reminder - Policy ${data.policyId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Premium Payment Reminder</h2>
        <p>Dear ${data.customerName},</p>
        <p>This is a reminder that your premium payment is due soon.</p>
        <p><strong>Policy ID:</strong> ${data.policyId}</p>
        <p><strong>Due Date:</strong> ${data.dueDate}</p>
        <p><strong>Amount:</strong> ₹${data.amount.toLocaleString('en-IN')}</p>
        <p>Please make the payment before the due date to avoid any inconvenience.</p>
      </div>
    `,
  }),

  claimStatusUpdate: (data: { customerName: string; claimId: string; status: string }) => ({
    subject: `Claim ${data.claimId} Status Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Claim Status Update</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your claim <strong>${data.claimId}</strong> status has been updated.</p>
        <p><strong>New Status:</strong> ${data.status}</p>
        <p>Please log in to your account for more details.</p>
      </div>
    `,
  }),

  paymentReceived: (data: { customerName: string; amount: number; transactionId: string }) => ({
    subject: `Payment Received - ₹${data.amount.toLocaleString('en-IN')}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10b981;">Payment Received</h2>
        <p>Dear ${data.customerName},</p>
        <p>We have received your payment successfully.</p>
        <p><strong>Amount:</strong> ₹${data.amount.toLocaleString('en-IN')}</p>
        <p><strong>Transaction ID:</strong> ${data.transactionId}</p>
        <p>Thank you for your payment.</p>
      </div>
    `,
  }),
};

