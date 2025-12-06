import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@lic.com',
      ...options,
    });
    return true;
  } catch (error) {
    console.error('Email send error:', error);
    return false;
  }
}

export async function sendLoanReminderEmail(
  email: string,
  customerName: string,
  loanId: string,
  dueAmount: number,
  dueDate: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #003366 0%, #0066cc 100%); color: white; padding: 20px; text-align: center;">
        <h1>LIC - Loan Payment Reminder</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Dear ${customerName},</p>
        <p>This is a friendly reminder that your loan payment is due.</p>
        <div style="background: white; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0;">
          <p><strong>Loan ID:</strong> ${loanId}</p>
          <p><strong>Due Amount:</strong> ₹${dueAmount.toLocaleString('en-IN')}</p>
          <p><strong>Due Date:</strong> ${dueDate}</p>
        </div>
        <p>Please make the payment before the due date to avoid any penalties.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Loan Payment Reminder - ${loanId}`,
    html,
  });
}

export async function sendPolicyRenewalEmail(
  email: string,
  customerName: string,
  policyId: string,
  renewalDate: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #003366 0%, #0066cc 100%); color: white; padding: 20px; text-align: center;">
        <h1>LIC - Policy Renewal Reminder</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Dear ${customerName},</p>
        <p>Your insurance policy is due for renewal.</p>
        <div style="background: white; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0;">
          <p><strong>Policy ID:</strong> ${policyId}</p>
          <p><strong>Renewal Date:</strong> ${renewalDate}</p>
        </div>
        <p>Please renew your policy to ensure continuous coverage.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Policy Renewal Reminder - ${policyId}`,
    html,
  });
}

export async function sendClaimStatusEmail(
  email: string,
  customerName: string,
  claimId: string,
  status: string
): Promise<boolean> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #003366 0%, #0066cc 100%); color: white; padding: 20px; text-align: center;">
        <h1>LIC - Claim Status Update</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <p>Dear ${customerName},</p>
        <p>Your claim status has been updated.</p>
        <div style="background: white; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0;">
          <p><strong>Claim ID:</strong> ${claimId}</p>
          <p><strong>Status:</strong> <span style="color: ${status === 'approved' ? 'green' : status === 'rejected' ? 'red' : 'orange'}; font-weight: bold;">${status.toUpperCase()}</span></p>
        </div>
        <p>Please log in to your account for more details.</p>
        <p style="margin-top: 30px; color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Claim Status Update - ${claimId}`,
    html,
  });
}
