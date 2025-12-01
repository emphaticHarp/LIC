"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DigitalSignatureProps {
  onSignatureSave?: (signatureData: string) => void;
  width?: number;
  height?: number;
  label?: string;
  className?: string;
}

export default function DigitalSignature({
  onSignatureSave,
  width = 400,
  height = 150,
  label = "Digital Signature",
  className = ""
}: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [error, setError] = useState("");
  const [signatureMode, setSignatureMode] = useState<'draw' | 'upload'>('draw');
  const [uploadedImage, setUploadedImage] = useState<string>("");

  useEffect(() => {
    if (signatureMode === 'draw') {
      initializeCanvas();
    }
  }, [signatureMode, width, height]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set drawing styles
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Fill with white background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    setIsEmpty(false);
    setError("");

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || signatureMode !== 'draw') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if ("touches" in e) {
      e.preventDefault();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    if (signatureMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    } else {
      setUploadedImage("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
    setIsEmpty(true);
    setError("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setUploadedImage(result);
      setIsEmpty(false);
      
      // Draw image on canvas for consistency
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const img = new Image();
          img.onload = () => {
            // Clear canvas
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, width, height);
            
            // Calculate aspect ratio to fit image
            const aspectRatio = img.width / img.height;
            let drawWidth = width;
            let drawHeight = height;
            
            if (aspectRatio > width / height) {
              drawHeight = width / aspectRatio;
            } else {
              drawWidth = height * aspectRatio;
            }
            
            // Center the image
            const x = (width - drawWidth) / 2;
            const y = (height - drawHeight) / 2;
            
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
          };
          img.src = result;
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const saveSignature = () => {
    let signatureData = "";

    if (signatureMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || isEmpty) {
        setError("Please provide your signature before saving");
        return;
      }
      signatureData = canvas.toDataURL("image/png");
    } else {
      if (!uploadedImage) {
        setError("Please upload a signature image before saving");
        return;
      }
      signatureData = uploadedImage;
    }

    onSignatureSave?.(signatureData);
  };

  const getSignatureData = (): string | null => {
    if (signatureMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || isEmpty) return null;
      return canvas.toDataURL("image/png");
    } else {
      return uploadedImage || null;
    }
  };

  // Expose methods through ref
  useEffect(() => {
    if (canvasRef.current) {
      (canvasRef.current as any).getSignatureData = getSignatureData;
      (canvasRef.current as any).clearSignature = clearSignature;
    }
  }, [isEmpty, uploadedImage, signatureMode]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg">{label}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant={signatureMode === 'draw' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSignatureMode('draw')}
          >
            Draw Signature
          </Button>
          <Button
            variant={signatureMode === 'upload' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSignatureMode('upload')}
          >
            Upload Image
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {signatureMode === 'draw' ? (
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="border-2 border-gray-300 rounded-lg cursor-crosshair touch-none"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{ width, height }}
            />
            {isEmpty && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-gray-400 text-sm">Sign here</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="border-2 border-gray-300 rounded-lg"
                style={{ width, height }}
              />
              {!uploadedImage && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-400 text-sm">Upload signature image</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signature-upload">Choose Signature Image</Label>
              <Input
                id="signature-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">
                Supported formats: JPG, PNG, GIF. Max size: 5MB
              </p>
            </div>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button variant="outline" onClick={clearSignature} className="flex-1">
            Clear {signatureMode === 'draw' ? 'Signature' : 'Image'}
          </Button>
          <Button onClick={saveSignature} className="flex-1" disabled={isEmpty}>
            Save Signature
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for accessing signature methods
export function useDigitalSignature(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const getSignatureData = () => {
    if (!canvasRef.current) return null;
    return (canvasRef.current as any).getSignatureData?.();
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    (canvasRef.current as any).clearSignature?.();
  };

  return { getSignatureData, clearSignature };
}
