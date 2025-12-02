import { NextRequest, NextResponse } from 'next/server';
import {
  processPayment,
  calculateGST,
  generateInvoice,
  verifyKYC,
  verifyBankAccount,
  initiateVideoKYC,
  verifyAadhaar,
  sendSMS,
  sendEmailService,
  sendWhatsAppMessage,
  signDocument,
} from '@/lib/integrations';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, action } = body;

    switch (service) {
      case 'payment':
        return handlePaymentService(body);

      case 'gst':
        return handleGSTService(body);

      case 'kyc':
        return handleKYCService(body);

      case 'bank':
        return handleBankService(body);

      case 'communication':
        return handleCommunicationService(body);

      case 'signature':
        return handleSignatureService(body);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid service' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in integrations API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

async function handlePaymentService(body: any) {
  const { action, amount, paymentMethod, customerId, orderId } = body;

  if (action === 'process') {
    if (!amount || !paymentMethod || !customerId || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await processPayment(amount, paymentMethod, customerId, orderId);
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  );
}

async function handleGSTService(body: any) {
  const { action, amount, gstRate, items } = body;

  if (action === 'calculate') {
    if (!amount) {
      return NextResponse.json(
        { success: false, error: 'Amount required' },
        { status: 400 }
      );
    }

    const result = calculateGST(amount, gstRate || 18);
    return NextResponse.json({ success: true, data: result });
  }

  if (action === 'generate_invoice') {
    if (!amount || !items) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const invoiceNumber = `INV-${Date.now()}`;
    const result = generateInvoice(
      invoiceNumber,
      body.customerId,
      amount,
      items,
      gstRate || 18
    );
    return NextResponse.json({ success: true, data: result });
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  );
}

async function handleKYCService(body: any) {
  const { action, panNumber, aadhaarNumber, name, customerId, email } = body;

  if (action === 'verify') {
    if (!panNumber || !aadhaarNumber || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await verifyKYC(panNumber, aadhaarNumber, name);
    return NextResponse.json(result);
  }

  if (action === 'verify_aadhaar') {
    if (!aadhaarNumber) {
      return NextResponse.json(
        { success: false, error: 'Aadhaar number required' },
        { status: 400 }
      );
    }

    const result = await verifyAadhaar(aadhaarNumber);
    return NextResponse.json(result);
  }

  if (action === 'initiate_video_kyc') {
    if (!customerId || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await initiateVideoKYC(customerId, email);
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  );
}

async function handleBankService(body: any) {
  const { action, accountNumber, ifscCode, accountHolderName } = body;

  if (action === 'verify') {
    if (!accountNumber || !ifscCode || !accountHolderName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await verifyBankAccount(
      accountNumber,
      ifscCode,
      accountHolderName
    );
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  );
}

async function handleCommunicationService(body: any) {
  const { action, phoneNumber, email, message, templateId } = body;

  if (action === 'send_sms') {
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone number and message required' },
        { status: 400 }
      );
    }

    const result = await sendSMS(phoneNumber, message);
    return NextResponse.json(result);
  }

  if (action === 'send_email') {
    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: 'Email and message required' },
        { status: 400 }
      );
    }

    const result = await sendEmailService(
      email,
      body.subject || 'Notification',
      message
    );
    return NextResponse.json(result);
  }

  if (action === 'send_whatsapp') {
    if (!phoneNumber || !message) {
      return NextResponse.json(
        { success: false, error: 'Phone number and message required' },
        { status: 400 }
      );
    }

    const result = await sendWhatsAppMessage(phoneNumber, message, templateId);
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  );
}

async function handleSignatureService(body: any) {
  const { action, documentId, userId, signingReason } = body;

  if (action === 'sign') {
    if (!documentId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const result = await signDocument(documentId, userId, signingReason || '');
    return NextResponse.json(result);
  }

  return NextResponse.json(
    { success: false, error: 'Invalid action' },
    { status: 400 }
  );
}
