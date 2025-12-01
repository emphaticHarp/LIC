"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ProfileSidebarProps {
  email: string;
  show: boolean;
  onClose: () => void;
}

export default function ProfileSidebar({ email, show, onClose }: ProfileSidebarProps) {
  const router = useRouter();
  
  if (!show) return null;

  return (
    <div className="w-80 bg-white border-l border-gray-200 h-[calc(100vh-4rem)] fixed right-0 top-16 shadow-lg z-40">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Profile Settings</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
              {email.charAt(0).toUpperCase()}
            </div>
            <h4 className="font-semibold">{email.split('@')[0]}</h4>
            <p className="text-sm text-gray-500">Premium Customer</p>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-600">{email}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Member Since</p>
              <p className="text-sm text-gray-600">January 2024</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Account Type</p>
              <p className="text-sm text-gray-600">Premium</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-200 space-y-2">
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => router.push(`/settings?email=${encodeURIComponent(email)}`)}
            >
              Settings
            </Button>
            <Button className="w-full" variant="outline">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
