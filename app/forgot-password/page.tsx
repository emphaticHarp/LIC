"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { AlertCircle, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // First check if email exists
      const checkResponse = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkResponse.json();

      if (!checkData.exists) {
        setErrorMessage("Email not registered. Please check and try again.");
        setShowErrorModal(true);
        setIsLoading(false);
        return;
      }

      // Email exists, send OTP
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          purpose: "PASSWORD_RESET" 
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowOTP(true);
      } else {
        setErrorMessage(data.error || "Failed to send OTP");
        setShowErrorModal(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send OTP");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          otp,
          purpose: "PASSWORD_RESET"
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        setErrorMessage(data.error || "Failed to verify OTP");
        setShowErrorModal(true);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to verify OTP");
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* LIC Logo Section */}
        <div className="text-center mb-6 sm:mb-8">
          <Image
            src="https://1000logos.net/wp-content/uploads/2021/08/LIC-Logo.jpg"
            alt="LIC Logo"
            width={120}
            height={120}
            className="mx-auto mb-3 sm:mb-4 rounded-lg"
            style={{ width: "auto", height: "auto" }}
            priority
          />
          <p className="text-xs sm:text-sm text-gray-600">Life Insurance Corporation of India</p>
        </div>

        {/* Forgot Password Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center mb-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg sm:text-xl">Forgot Password</CardTitle>
            </div>
            <CardDescription className="text-sm">
              {!showOTP 
                ? "Enter your email to receive a verification code"
                : "Enter the 6-digit OTP sent to your email"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Error Modal */}
            <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Error
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-gray-700">
                  {errorMessage}
                </DialogDescription>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    onClick={() => setShowErrorModal(false)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Try Again
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {!showOTP ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    We'll send a 6-digit OTP to your email
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label>Verification Code</Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="text-center text-sm text-gray-500">
                    {otp === "" ? (
                      <>Enter the 6-digit code sent to {email}</>
                    ) : (
                      <>You entered: {otp}</>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setShowOTP(false);
                      setOtp("");
                      setError("");
                    }}
                  >
                    Back to Email
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© 2024 Life Insurance Corporation of India. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

