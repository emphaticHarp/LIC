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
import { AlertCircle, ArrowLeft, Phone } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Just show OTP screen without any real functionality
    setShowOTP(true);
    setIsLoading(false);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Just show success and redirect
    setSuccess(true);
    setIsLoading(false);
    
    // Redirect to reset password page
    setTimeout(() => {
      router.push(`/reset-password?phone=${encodeURIComponent(phoneNumber)}`);
    }, 2000);
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
                ? "Enter your phone number to receive a verification code"
                : "Enter the 6-digit verification code sent to your phone"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-900">Success!</AlertTitle>
                <AlertDescription className="text-green-800">
                  Phone verified successfully!
                </AlertDescription>
              </Alert>
            )}

            {!showOTP ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Enter your 10-digit mobile number (India)
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
                      value={verificationCode}
                      onChange={(value) => setVerificationCode(value)}
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
                    {verificationCode === "" ? (
                      <>Enter the 6-digit code sent to {phoneNumber}</>
                    ) : (
                      <>You entered: {verificationCode}</>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading || verificationCode.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      setShowOTP(false);
                      setVerificationCode("");
                      setError("");
                    }}
                  >
                    Back to Phone Number
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

