import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { Loan } from "@/models/Loan";

const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(MONGODB_URI || "");
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Generate unique loan ID
    const loanId = `LN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const loanData = {
      loanId,
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      dateOfBirth: body.dateOfBirth,
      loanType: body.loanType,
      loanAmount: body.loanAmount,
      tenure: body.tenure,
      interestRate: body.interestRate,
      emi: body.emi,
      totalAmount: body.totalAmount,
      totalInterest: body.totalInterest,
      annualIncome: body.annualIncome,
      employmentType: body.employmentType,
      existingLoans: body.existingLoans || 0,
      creditScore: body.creditScore,
      additionalInfo: body.additionalInfo,
      documents: body.documents || [],
      status: "pending",
    };

    const loan = new Loan(loanData);
    await loan.save();

    return NextResponse.json({
      success: true,
      message: "Loan application submitted successfully",
      data: loan,
      loanId: loanId,
    });
  } catch (error: any) {
    console.error("Error submitting loan application:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to submit loan application",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const loanId = searchParams.get("loanId");

    if (loanId) {
      const loan = await Loan.findOne({ loanId });
      if (!loan) {
        return NextResponse.json(
          { success: false, error: "Loan not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: loan });
    }

    const loans = await Loan.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, data: loans });
  } catch (error: any) {
    console.error("Error fetching loans:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { loanId, action, data } = body;

    const loan = await Loan.findOne({ loanId });
    if (!loan) {
      return NextResponse.json(
        { success: false, error: "Loan not found" },
        { status: 404 }
      );
    }

    if (action === "updateKYC") {
      loan.kycStatus = data.status;
      loan.kycVerifiedBy = data.verifiedBy;
      loan.kycVerificationDate = data.verificationDate;
      loan.kycNotes = data.notes;
    } else if (action === "recordPayment") {
      loan.paymentHistory.push({
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        paymentDate: new Date(),
        notes: data.notes,
      });
      loan.paidAmount = (loan.paidAmount || 0) + data.amount;
      loan.remainingAmount = loan.totalAmount - loan.paidAmount;
      
      if (loan.remainingAmount <= 0) {
        loan.paymentStatus = "completed";
      } else if (loan.paidAmount > 0) {
        loan.paymentStatus = "partial";
      }
    } else if (action === "sendReminder") {
      loan.reminders.push({
        reminderType: data.reminderType,
        message: data.message,
        dueDate: data.dueDate,
        sentDate: new Date(),
        status: "sent",
      });
    }

    await loan.save();

    return NextResponse.json({
      success: true,
      message: "Loan updated successfully",
      data: loan,
    });
  } catch (error: any) {
    console.error("Error updating loan:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
