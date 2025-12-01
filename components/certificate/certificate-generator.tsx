"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import DigitalSignature from "@/components/ui/digital-signature";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

interface CertificateData {
  policyId: string;
  customerName: string;
  policyType: string;
  issueDate: string;
  expiryDate: string;
  sumAssured: string;
  premium: string;
  certificateNumber: string;
  authorizedBy: string;
  authorizedTitle: string;
}

interface PaymentData {
  id: string;
  customerName: string;
  policyId: string;
  amount: string;
  paymentMethod: string;
  upiMethod?: string;
  cardType?: string;
  bankName?: string;
  transactionId: string;
  date: string;
  time: string;
  status: string;
}

interface CertificateGeneratorProps {
  policyData?: Partial<CertificateData>;
  paymentData?: PaymentData;
  certificateType?: 'policy' | 'payment';
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificateGenerator({
  policyData = {},
  paymentData,
  certificateType = 'policy',
  isOpen,
  onClose
}: CertificateGeneratorProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLCanvasElement>(null);
  const [certificateData, setCertificateData] = useState<CertificateData>({
    policyId: "",
    customerName: "",
    policyType: "",
    issueDate: new Date().toLocaleDateString('en-IN'),
    expiryDate: "",
    sumAssured: "",
    premium: "",
    certificateNumber: "",
    authorizedBy: "Authorized Signatory",
    authorizedTitle: "Branch Manager",
    ...policyData
  });
  const [signatureData, setSignatureData] = useState<string>("");
  const [qrCodeData, setQrCodeData] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Generate QR code for verification
  const generateQRCode = async () => {
    try {
      const verificationUrl = `https://lic-india.com/verify/${certificateData.certificateNumber}`;
      const qrDataUrl = await QRCode.toDataURL(verificationUrl, {
        width: 100,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      setQrCodeData(qrDataUrl);
    } catch (err) {
      console.error("Error generating QR code:", err);
    }
  };

  // Generate certificate number
  const generateCertificateNumber = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `LIC-CERT-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
  };

  // Initialize certificate data and generate QR code
  useEffect(() => {
    if (certificateType === 'payment' && paymentData && !certificateData.certificateNumber) {
      // Initialize with payment data only if not already initialized
      setCertificateData(prev => ({
        ...prev,
        policyId: paymentData.policyId,
        customerName: paymentData.customerName,
        policyType: 'Payment Receipt',
        issueDate: paymentData.date,
        expiryDate: '',
        sumAssured: paymentData.amount,
        premium: paymentData.amount,
        certificateNumber: paymentData.id
      }));
    } else if (certificateType === 'policy' && policyData && Object.keys(policyData).length > 0 && !certificateData.certificateNumber) {
      // Initialize with policy data only if not already initialized
      setCertificateData(prev => ({
        ...prev,
        ...policyData,
        certificateNumber: prev.certificateNumber || generateCertificateNumber()
      }));
    } else if (!certificateData.certificateNumber) {
      setCertificateData(prev => ({
        ...prev,
        certificateNumber: generateCertificateNumber()
      }));
    }
  }, [certificateType, paymentData, policyData, certificateData.certificateNumber]);

  // Generate QR code when certificate number is available
  useEffect(() => {
    if (certificateData.certificateNumber) {
      generateQRCode();
    }
  }, [certificateData.certificateNumber]);

  const handleInputChange = (field: keyof CertificateData, value: string) => {
    setCertificateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignatureSave = (signature: string) => {
    console.log("Signature saved:", signature ? "Yes" : "No", signature?.substring(0, 50) + "...");
    setSignatureData(signature);
  };

  const generateCertificatePDF = async () => {
    console.log("Generate PDF called. Signature data present:", signatureData ? "Yes" : "No");
    console.log("Certificate type:", certificateType);
    
    if (!signatureData) {
      console.log("No signature data, showing error");
      setError("Please provide a signature to generate the certificate");
      return;
    }

    // For policy certificates, require certificate ref
    if (certificateType === 'policy' && !certificateRef.current) {
      console.log("Policy certificate but no ref");
      setError("Certificate preview not ready");
      return;
    }

    console.log("Starting PDF generation...");
    setIsGenerating(true);
    setError("");

    try {
      // Create a completely isolated iframe to avoid any CSS interference
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '595px';  // A4 width in pixels at 96 DPI
      iframe.style.height = '842px'; // A4 height in pixels at 96 DPI
      iframe.style.border = 'none';
      
      document.body.appendChild(iframe);
      
      // Wait for iframe to load
      await new Promise(resolve => {
        iframe.onload = resolve;
        setTimeout(resolve, 100); // Fallback timeout
      });
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error("Unable to access iframe document");
      }

      // Create a clean HTML document with no external CSS
      const isPaymentCertificate = certificateType === 'payment';
      const cleanHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
              font-family: 'Courier New', monospace;
            }
            body {
              background-color: #ffffff;
              color: #000000;
              width: 595px;
              height: 842px;
              overflow: hidden;
              padding: 1rem;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 3px double #000;
              padding-bottom: 1rem;
              margin-bottom: 1rem;
            }
            .logo { 
              width: 3rem; 
              height: 3rem; 
              margin: 0 auto 0.5rem auto;
              object-fit: contain;
            }
            .logo-fallback { 
              width: 3rem; 
              height: 3rem; 
              margin: 0 auto 0.5rem auto;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f8f9fa;
              border: 2px solid #2563eb;
              border-radius: 50%;
            }
            .logo-text {
              font-size: 0.8rem;
              font-weight: bold;
              color: #2563eb;
              text-align: center;
            }
            .company-name { 
              font-size: 1.2rem; 
              font-weight: bold; 
              margin-bottom: 0.25rem;
              letter-spacing: 2px;
            }
            .receipt-title { 
              font-size: 1rem; 
              font-weight: bold; 
              margin-bottom: 0.25rem;
              text-transform: uppercase;
            }
            .receipt-subtitle { 
              font-size: 0.8rem; 
              color: #666;
              margin-bottom: 0.5rem;
            }
            .receipt-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 0.5rem;
              margin-bottom: 1rem;
              border: 1px solid #000;
              padding: 0.5rem;
            }
            .receipt-info-left {
              border-right: 1px solid #000;
              padding-right: 0.5rem;
            }
            .receipt-info-right {
              padding-left: 0.5rem;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 0.25rem;
              font-size: 0.7rem;
            }
            .info-label {
              font-weight: bold;
            }
            .info-value {
              text-align: right;
            }
            .payment-details {
              margin-bottom: 1rem;
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 0.25rem 0;
              border-bottom: 1px dashed #ccc;
              font-size: 0.7rem;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .total-row {
              border-top: 2px solid #000;
              border-bottom: 2px solid #000;
              font-weight: bold;
              padding: 0.5rem 0;
              margin-top: 0.5rem;
            }
            .payment-method {
              text-align: center;
              margin: 1rem 0;
              padding: 0.5rem;
              border: 1px solid #000;
              background-color: #f9f9f9;
            }
            .method-title {
              font-size: 0.8rem;
              font-weight: bold;
              margin-bottom: 0.25rem;
            }
            .method-details {
              font-size: 0.7rem;
            }
            .signature-section {
              margin-top: 2rem;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .signature-box {
              width: 45%;
              text-align: center;
            }
            .signature-line {
              border-top: 1px solid #000;
              padding-top: 0.25rem;
              margin-bottom: 0.25rem;
            }
            .signature-img {
              width: 4rem;
              height: 2rem;
              margin: 0 auto 0.25rem auto;
            }
            .signature-text {
              font-size: 0.6rem;
              font-weight: bold;
            }
            .signature-title {
              font-size: 0.5rem;
              color: #666;
            }
            .verification-section {
              margin-top: 1rem;
              text-align: center;
              font-size: 0.6rem;
              color: #666;
            }
            .qr-code {
              width: 2rem;
              height: 2rem;
              margin: 0 auto 0.25rem auto;
              border: 1px solid #ccc;
            }
            .hidden { display: none; }
            .amount-highlight {
              font-weight: bold;
              color: #2563eb;
            }
          </style>
        </head>
        <body>
          <div class="receipt-header">
            <img src="https://1000logos.net/wp-content/uploads/2021/08/LIC-Logo.jpg" alt="LIC Logo" class="logo" id="lic-logo" />
            <div class="logo-fallback hidden" id="logo-fallback">
              <div class="logo-text">LIC</div>
            </div>
            <div class="company-name">LIFE INSURANCE CORPORATION</div>
            <div class="receipt-title">CASH RECEIPT</div>
            <div class="receipt-subtitle">Government of India Undertaking</div>
          </div>
          
          <div class="receipt-info">
            <div class="receipt-info-left">
              <div class="info-row">
                <span class="info-label">Receipt No:</span>
                <span class="info-value">${certificateData.certificateNumber}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Date:</span>
                <span class="info-value">${certificateData.issueDate}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Time:</span>
                <span class="info-value">${paymentData?.time || 'N/A'}</span>
              </div>
            </div>
            <div class="receipt-info-right">
              <div class="info-row">
                <span class="info-label">Policy ID:</span>
                <span class="info-value">${certificateData.policyId}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Customer:</span>
                <span class="info-value">${certificateData.customerName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Transaction ID:</span>
                <span class="info-value">${paymentData?.transactionId || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div class="payment-details">
            <div class="detail-row">
              <span>PAYMENT DESCRIPTION</span>
              <span>AMOUNT</span>
            </div>
            <div class="detail-row">
              <span>Insurance Premium Payment</span>
              <span>${certificateData.sumAssured}</span>
            </div>
            ${paymentData ? `
              <div class="detail-row">
                <span>Payment Method</span>
                <span>${paymentData.paymentMethod === "upi" && paymentData.upiMethod ? 
                  paymentData.upiMethod.charAt(0).toUpperCase() + paymentData.upiMethod.slice(1) :
                  paymentData.paymentMethod === "card" && paymentData.cardType ?
                  paymentData.cardType.charAt(0).toUpperCase() + paymentData.cardType.slice(1) + " Card" :
                  paymentData.paymentMethod === "netbanking" && paymentData.bankName ?
                  paymentData.bankName :
                  paymentData.paymentMethod.charAt(0).toUpperCase() + paymentData.paymentMethod.slice(1)
                }</span>
              </div>
            ` : ''}
            <div class="detail-row total-row">
              <span>TOTAL PAID</span>
              <span class="amount-highlight">${certificateData.sumAssured}</span>
            </div>
          </div>
          
          ${paymentData ? `
            <div class="payment-method">
              <div class="method-title">PAYMENT METHOD DETAILS</div>
              <div class="method-details">
                ${paymentData.paymentMethod === "upi" ? 
                  `UPI Platform: ${paymentData.upiMethod ? paymentData.upiMethod.charAt(0).toUpperCase() + paymentData.upiMethod.slice(1) : 'N/A'}` :
                  paymentData.paymentMethod === "card" ?
                  `Card Type: ${paymentData.cardType ? paymentData.cardType.charAt(0).toUpperCase() + paymentData.cardType.slice(1) : 'N/A'}` :
                  paymentData.paymentMethod === "netbanking" ?
                  `Bank: ${paymentData.bankName || 'N/A'}` :
                  `Method: ${paymentData.paymentMethod ? paymentData.paymentMethod.charAt(0).toUpperCase() + paymentData.paymentMethod.slice(1) : 'N/A'}`
                }
              </div>
            </div>
          ` : ''}
          
          <div class="signature-section">
            <div class="signature-box">
              ${signatureData ? `<img src="${signatureData}" alt="Authorized Signature" class="signature-img" />` : ''}
              <div class="signature-line">
                <div class="signature-text">${certificateData.authorizedBy}</div>
                <div class="signature-title">${certificateData.authorizedTitle}</div>
                <div class="signature-title">Authorized Signatory</div>
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line">
                <div class="signature-text">RECEIVED BY</div>
                <div class="signature-title">${certificateData.customerName}</div>
                <div class="signature-title">Payer Signature</div>
              </div>
            </div>
          </div>
          
          <div class="verification-section">
            ${qrCodeData ? `<img src="${qrCodeData}" alt="Verification QR Code" class="qr-code" />` : ''}
            <div>Receipt ID: ${certificateData.certificateNumber}</div>
            <div>Digitally Signed & Verified</div>
            <div>This receipt is electronically generated and valid</div>
          </div>
          
          <script>
            // Fallback mechanism for logo
            const logoImg = document.getElementById('lic-logo');
            const fallbackLogo = document.getElementById('logo-fallback');
            
            logoImg.onerror = function() {
              logoImg.style.display = 'none';
              fallbackLogo.style.display = 'flex';
            };
            
            logoImg.onload = function() {
              logoImg.style.display = 'block';
              fallbackLogo.style.display = 'none';
            };
          </script>
        </body>
        </html>
      `;

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 200));

      // Convert logo to base64 for reliable rendering
      let logoDataUrl = "";
      try {
        const logoResponse = await fetch("https://1000logos.net/wp-content/uploads/2021/08/LIC-Logo.jpg");
        const logoBlob = await logoResponse.blob();
        logoDataUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(logoBlob);
        });
      } catch (error) {
        console.warn("Failed to load logo, will use fallback");
      }

      // Update the HTML with the base64 logo if available
      const finalHTML = logoDataUrl ? 
        cleanHTML.replace('https://1000logos.net/wp-content/uploads/2021/08/LIC-Logo.jpg', logoDataUrl) :
        cleanHTML;

      iframeDoc.open();
      iframeDoc.write(finalHTML);
      iframeDoc.close();

      // Wait for content to render
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate canvas from the iframe body
      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        width: 595,
        height: 842,
        windowWidth: 595,
        windowHeight: 842,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: false,
        imageTimeout: 15000
      });

      // Remove the iframe
      document.body.removeChild(iframe);

      // Verify canvas was created successfully
      if (!canvas || canvas.width === 0 || canvas.height === 0) {
        throw new Error("Failed to generate certificate image");
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add certificate image to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Add metadata
      pdf.setProperties({
        title: `Insurance Certificate - ${certificateData.certificateNumber}`,
        subject: 'Life Insurance Certificate',
        author: 'Life Insurance Corporation of India',
        keywords: 'insurance, certificate, lic',
        creator: 'LIC Digital Certificate System'
      });

      // Add digital signature metadata as a hidden annotation
      if (signatureData) {
        const signatureInfo = {
          certificateNumber: certificateData.certificateNumber,
          issueDate: certificateData.issueDate,
          signatureData: signatureData.substring(0, 100) + "...",
          verificationHash: btoa(certificateData.certificateNumber + certificateData.issueDate)
        };
        
        pdf.setFontSize(1);
        pdf.setTextColor(255, 255, 255);
        pdf.text(JSON.stringify(signatureInfo), -50, -50);
      }

      // Download the PDF
      const fileName = `LIC_Certificate_${certificateData.certificateNumber}.pdf`;
      pdf.save(fileName);

      onClose();
    } catch (err) {
      console.error("Error generating certificate:", err);
      let errorMessage = "Failed to generate certificate. Please try again.";
      
      if (err instanceof Error) {
        if (err.message.includes("Unable to find element")) {
          errorMessage = "Certificate content not ready. Please try again in a moment.";
        } else if (err.message.includes("timeout")) {
          errorMessage = "Generation timed out. Please try again.";
        } else if (err.message.includes("not found")) {
          errorMessage = "Certificate element not found. Please refresh and try again.";
        } else if (err.message.includes("lab")) {
          errorMessage = "Color processing error. Please try again.";
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{certificateType === 'payment' ? 'Generate Payment Certificate' : 'Generate Insurance Certificate'}</DialogTitle>
          <DialogDescription>
            {certificateType === 'payment' ? 
              'Create a digitally signed payment receipt certificate with QR verification' :
              'Create a digitally signed insurance certificate with QR verification'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {certificateType === 'policy' && (
            <>
              {/* Certificate Preview - Only for Policy Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    ref={certificateRef}
                    style={{ 
                      minHeight: "400px", 
                      backgroundColor: "#ffffff",
                      padding: "2rem",
                      border: "4px double #2563eb",
                      borderRadius: "0.5rem"
                    }}
                  >
                    {/* Certificate Header */}
                    <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                        <img
                          src="https://1000logos.net/wp-content/uploads/2021/08/LIC-Logo.jpg"
                          alt="LIC Logo"
                          style={{ width: "5rem", height: "5rem" }}
                        />
                      </div>
                      <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", marginBottom: "0.5rem", color: "#1e40af" }}>
                        Life Insurance Corporation of India
                      </h1>
                      <p style={{ fontSize: "1.125rem", marginBottom: "1rem", color: "#6b7280" }}>Certificate of Insurance</p>
                      <div style={{ width: "8rem", height: "0.25rem", margin: "0 auto 1rem auto", backgroundColor: "#2563eb" }}></div>
                    </div>

                    {/* Certificate Content */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
                      <div>
                        <h3 style={{ fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Policy Details</h3>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Certificate Number:</strong> {certificateData.certificateNumber}
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Policy ID:</strong> {certificateData.policyId}
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Policy Type:</strong> {certificateData.policyType}
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Sum Assured:</strong> {certificateData.sumAssured}
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Annual Premium:</strong> {certificateData.premium}
                        </div>
                      </div>
                      <div>
                        <h3 style={{ fontWeight: "600", marginBottom: "1rem", color: "#374151" }}>Policyholder Information</h3>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Policyholder Name:</strong> {certificateData.customerName}
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Issue Date:</strong> {certificateData.issueDate}
                        </div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Expiry Date:</strong> {certificateData.expiryDate}
                        </div>
                        <div style={{ marginTop: "1rem" }}>
                          <strong>Verification QR Code:</strong>
                          {qrCodeData && (
                            <div style={{ marginTop: "0.5rem" }}>
                              <img src={qrCodeData} alt="Verification QR Code" style={{ width: "6rem", height: "6rem", border: "1px solid #d1d5db" }} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Certificate Body */}
                    <div style={{ textAlign: "center", marginBottom: "2rem", lineHeight: "1.625", color: "#374151" }}>
                      <p>This is to certify that <strong>{certificateData.customerName}</strong> is insured under Policy No. <strong>{certificateData.policyId}</strong> with the Life Insurance Corporation of India. This policy provides coverage as per the terms and conditions specified in the policy document.</p>
                    </div>

                    {/* Signatures */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "3rem" }}>
                      <div style={{ textAlign: "center" }}>
                        {signatureData && (
                          <img src={signatureData} alt="Authorized Signature" style={{ width: "8rem", height: "4rem", marginBottom: "0.5rem" }} />
                        )}
                        <div style={{ borderTop: "2px solid #1f2937", paddingTop: "0.5rem" }}>
                          <p style={{ fontWeight: "600" }}>{certificateData.authorizedBy}</p>
                          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>{certificateData.authorizedTitle}</p>
                          <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Life Insurance Corporation of India</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <div style={{ borderTop: "2px solid #1f2937", paddingTop: "0.5rem" }}>
                          <p style={{ fontWeight: "600" }}>Digital Verification</p>
                          <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>Certificate ID: {certificateData.certificateNumber}</p>
                          <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Digitally Signed & Verified</p>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: "0.75rem", color: "#9ca3af" }}>This certificate is digitally signed and verifiable online</p>
                      <div style={{ padding: "0.25rem 0.5rem", border: "1px solid #d1d5db", fontSize: "0.75rem", color: "#6b7280" }}>
                        Digitally Signed
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Certificate Details Form - Only for Policy Certificates */}
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policyId">Policy ID</Label>
                      <Input
                        id="policyId"
                        value={certificateData.policyId}
                        onChange={(e) => handleInputChange("policyId", e.target.value)}
                        placeholder="Enter policy ID"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerName">Policyholder Name</Label>
                      <Input
                        id="customerName"
                        value={certificateData.customerName}
                        onChange={(e) => handleInputChange("customerName", e.target.value)}
                        placeholder="Enter policyholder name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="policyType">Policy Type</Label>
                      <Select value={certificateData.policyType} onValueChange={(value) => handleInputChange("policyType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select policy type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Term Life">Term Life</SelectItem>
                          <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                          <SelectItem value="Car Insurance">Car Insurance</SelectItem>
                          <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                          <SelectItem value="Endowment">Endowment</SelectItem>
                          <SelectItem value="ULIP">ULIP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sumAssured">Sum Assured</Label>
                      <Input
                        id="sumAssured"
                        value={certificateData.sumAssured}
                        onChange={(e) => handleInputChange("sumAssured", e.target.value)}
                        placeholder="Enter sum assured amount"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="premium">Annual Premium</Label>
                      <Input
                        id="premium"
                        value={certificateData.premium}
                        onChange={(e) => handleInputChange("premium", e.target.value)}
                        placeholder="Enter annual premium"
                      />
                    </div>
                    <div>
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <Input
                        id="issueDate"
                        type="date"
                        value={certificateData.issueDate}
                        onChange={(e) => handleInputChange("issueDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={certificateData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="authorizedBy">Authorized By</Label>
                      <Input
                        id="authorizedBy"
                        value={certificateData.authorizedBy}
                        onChange={(e) => handleInputChange("authorizedBy", e.target.value)}
                        placeholder="Enter authorized person name"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="authorizedTitle">Authorized Title</Label>
                    <Input
                      id="authorizedTitle"
                      value={certificateData.authorizedTitle}
                      onChange={(e) => handleInputChange("authorizedTitle", e.target.value)}
                      placeholder="Enter authorized person title"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Digital Signature - For Both Certificate Types */}
          <Card>
            <CardHeader>
              <CardTitle>Digital Signature</CardTitle>
            </CardHeader>
            <CardContent>
              <DigitalSignature 
                onSignatureSave={handleSignatureSave}
                width={400}
                height={200}
              />
            </CardContent>
          </Card>

          {/* Payment Certificate Info - Only for Payment Certificates */}
          {certificateType === 'payment' && paymentData && (
            <Card>
              <CardHeader>
                <CardTitle>Payment Certificate Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Payment ID</Label>
                    <p className="text-sm font-medium">{paymentData.id}</p>
                  </div>
                  <div>
                    <Label>Payer Name</Label>
                    <p className="text-sm font-medium">{paymentData.customerName}</p>
                  </div>
                  <div>
                    <Label>Amount Paid</Label>
                    <p className="text-sm font-medium text-green-600">{paymentData.amount}</p>
                  </div>
                  <div>
                    <Label>Payment Method</Label>
                    <p className="text-sm font-medium">
                      {paymentData.paymentMethod === "upi" && paymentData.upiMethod ? 
                        paymentData.upiMethod.charAt(0).toUpperCase() + paymentData.upiMethod.slice(1) :
                        paymentData.paymentMethod === "card" && paymentData.cardType ?
                        paymentData.cardType.charAt(0).toUpperCase() + paymentData.cardType.slice(1) + " Card" :
                        paymentData.paymentMethod === "netbanking" && paymentData.bankName ?
                        paymentData.bankName :
                        paymentData.paymentMethod.charAt(0).toUpperCase() + paymentData.paymentMethod.slice(1)
                      }
                    </p>
                  </div>
                  <div>
                    <Label>Transaction ID</Label>
                    <p className="text-sm font-mono">{paymentData.transactionId}</p>
                  </div>
                  <div>
                    <Label>Payment Date</Label>
                    <p className="text-sm font-medium">{paymentData.date} at {paymentData.time}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Debug Info */}
          <div className="text-xs text-gray-500 space-y-1">
            <p>Debug: Signature present: {signatureData ? "Yes" : "No"}</p>
            <p>Debug: Certificate type: {certificateType}</p>
            <p>Debug: Button disabled: {isGenerating || !signatureData ? "Yes" : "No"}</p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generate Button */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={generateCertificatePDF} 
              disabled={isGenerating || !signatureData}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate & Download Certificate
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
