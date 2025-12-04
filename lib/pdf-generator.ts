import jsPDF from 'jspdf';

export interface LoanApplicationData {
  loanId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  loanType: string;
  loanAmount: number;
  tenure: number;
  interestRate: number;
  emi: number;
  totalAmount: number;
  totalInterest: number;
  annualIncome: number;
  employmentType: string;
  existingLoans: number;
  creditScore?: number;
  additionalInfo?: string;
  createdAt: string;
}

export function generateLoanPDF(data: LoanApplicationData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - 2 * margin;

  let yPosition = margin;

  // Header with LIC branding
  doc.setFillColor(0, 51, 102); // Dark blue (LIC color)
  doc.rect(0, 0, pageWidth, 25, 'F');

  // LIC Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('LIC', margin, 12);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Life Insurance Corporation of India', margin + 10, 12);

  // Title
  doc.setTextColor(0, 51, 102);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  yPosition = 35;
  doc.text('LOAN APPLICATION FORM', margin, yPosition);

  // Loan ID and Date
  yPosition += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(`Loan ID: ${data.loanId}`, margin, yPosition);
  doc.text(`Date: ${new Date(data.createdAt).toLocaleDateString('en-IN')}`, pageWidth - margin - 40, yPosition);

  // Divider line
  yPosition += 5;
  doc.setDrawColor(0, 51, 102);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  // Section 1: Personal Information
  yPosition += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('1. PERSONAL INFORMATION', margin, yPosition);

  yPosition += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const personalInfo = [
    { label: 'Full Name:', value: data.fullName },
    { label: 'Email:', value: data.email },
    { label: 'Phone:', value: data.phone },
    { label: 'Date of Birth:', value: new Date(data.dateOfBirth).toLocaleDateString('en-IN') },
  ];

  personalInfo.forEach((info) => {
    doc.setFont('helvetica', 'bold');
    doc.text(info.label, margin + 2, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(info.value, margin + 35, yPosition);
    yPosition += 5;
  });

  // Section 2: Loan Details
  yPosition += 3;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('2. LOAN DETAILS', margin, yPosition);

  yPosition += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const loanDetails = [
    { label: 'Loan Type:', value: data.loanType.charAt(0).toUpperCase() + data.loanType.slice(1) },
    { label: 'Loan Amount:', value: `₹${data.loanAmount.toLocaleString('en-IN')}` },
    { label: 'Tenure:', value: `${data.tenure} months` },
    { label: 'Interest Rate:', value: `${data.interestRate}% p.a.` },
    { label: 'Monthly EMI:', value: `₹${data.emi.toLocaleString('en-IN', { maximumFractionDigits: 2 })}` },
  ];

  loanDetails.forEach((detail) => {
    doc.setFont('helvetica', 'bold');
    doc.text(detail.label, margin + 2, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(detail.value, margin + 35, yPosition);
    yPosition += 5;
  });

  // Section 3: Financial Summary
  yPosition += 3;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('3. FINANCIAL SUMMARY', margin, yPosition);

  yPosition += 7;
  doc.setFontSize(9);

  // Summary box
  doc.setFillColor(240, 245, 250);
  doc.rect(margin, yPosition - 2, contentWidth, 20, 'F');
  doc.setDrawColor(0, 51, 102);
  doc.rect(margin, yPosition - 2, contentWidth, 20);

  doc.setFont('helvetica', 'bold');
  doc.text('Principal Amount:', margin + 3, yPosition + 2);
  doc.setFont('helvetica', 'normal');
  doc.text(`₹${data.loanAmount.toLocaleString('en-IN')}`, pageWidth - margin - 30, yPosition + 2);

  doc.setFont('helvetica', 'bold');
  doc.text('Total Interest:', margin + 3, yPosition + 8);
  doc.setFont('helvetica', 'normal');
  doc.text(`₹${data.totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, pageWidth - margin - 30, yPosition + 8);

  doc.setFont('helvetica', 'bold');
  doc.text('Total Amount Payable:', margin + 3, yPosition + 14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 102, 0);
  doc.text(`₹${data.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, pageWidth - margin - 30, yPosition + 14);

  yPosition += 25;

  // Section 4: Employment & Income
  doc.setTextColor(0, 51, 102);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('4. EMPLOYMENT & INCOME', margin, yPosition);

  yPosition += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  const employmentInfo = [
    { label: 'Employment Type:', value: data.employmentType.charAt(0).toUpperCase() + data.employmentType.slice(1) },
    { label: 'Annual Income:', value: `₹${data.annualIncome.toLocaleString('en-IN')}` },
    { label: 'Existing Loans:', value: `₹${data.existingLoans.toLocaleString('en-IN')}` },
  ];

  if (data.creditScore) {
    employmentInfo.push({ label: 'Credit Score:', value: data.creditScore.toString() });
  }

  employmentInfo.forEach((info) => {
    doc.setFont('helvetica', 'bold');
    doc.text(info.label, margin + 2, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(info.value, margin + 35, yPosition);
    yPosition += 5;
  });

  // Additional Information
  if (data.additionalInfo) {
    yPosition += 3;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 51, 102);
    doc.text('5. ADDITIONAL INFORMATION', margin, yPosition);

    yPosition += 6;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const splitText = doc.splitTextToSize(data.additionalInfo, contentWidth - 4);
    doc.text(splitText, margin + 2, yPosition);
    yPosition += splitText.length * 4 + 2;
  }

  // Signature Section
  yPosition = pageHeight - 40;

  doc.setDrawColor(0, 51, 102);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 51, 102);
  doc.text('SIGNATURES', margin, yPosition);

  yPosition += 10;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);

  // Customer Signature
  doc.text('Customer Signature:', margin, yPosition);
  doc.setDrawColor(150, 150, 150);
  doc.line(margin, yPosition + 2, margin + 40, yPosition + 2);
  doc.text('_____________________', margin, yPosition + 5);

  // Agent Signature
  doc.text('Agent Signature:', pageWidth - margin - 50, yPosition);
  doc.line(pageWidth - margin - 50, yPosition + 2, pageWidth - margin - 10, yPosition + 2);
  doc.text('_____________________', pageWidth - margin - 50, yPosition + 5);

  // Footer
  yPosition = pageHeight - 8;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('This is an electronically generated document. No signature is required.', margin, yPosition);
  doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, pageWidth - margin - 50, yPosition);

  return doc;
}
