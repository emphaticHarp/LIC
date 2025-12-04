import { NextRequest, NextResponse } from 'next/server';

// Razorpay Payment Gateway Integration
// For production, install: npm install razorpay
// Get API keys from: https://dashboard.razorpay.com/app/keys

interface PaymentRequest {
  amount: number; // Amount in paise (e.g., 10000 = ₹100)
  currency?: string;
  customerId: string;
  policyId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description?: string;
}

interface PaymentResponse {
  orderId: string;
  amount: number;
  currency: string;
  key: string; // Razorpay key ID
}

export async function POST(request: NextRequest) {
  try {
    const paymentData: PaymentRequest = await request.json();

    // Validate required fields
    if (!paymentData.amount || !paymentData.customerId || !paymentData.policyId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production, use Razorpay SDK:
    /*
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: paymentData.amount, // Amount in paise
      currency: paymentData.currency || 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        customerId: paymentData.customerId,
        policyId: paymentData.policyId,
        customerName: paymentData.customerName,
      },
    };

    const order = await razorpay.orders.create(options);
    */

    // Mock implementation for development
    const mockOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('💳 Payment Order Created:', {
      orderId: mockOrderId,
      amount: paymentData.amount,
      customerId: paymentData.customerId,
      policyId: paymentData.policyId,
    });

    return NextResponse.json({
      success: true,
      order: {
        id: mockOrderId,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        receipt: `receipt_${Date.now()}`,
        status: 'created',
        created_at: Math.floor(Date.now() / 1000),
      },
      // In production, return actual Razorpay key ID
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock_key',
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

// Verify payment webhook
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    // In production, verify signature:
    /*
    const crypto = require('crypto');
    const Razorpay = require('razorpay');
    
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
    */

    // Mock verification
    console.log('✅ Payment Verified:', {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}

