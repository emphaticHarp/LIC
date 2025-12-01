"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSidebarProps {
  email: string;
  show: boolean;
  onClose: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfileSidebar({ email, show, onClose }: ProfileSidebarProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    name: "",
    email: email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch user profile data when sidebar opens
  useEffect(() => {
    if (show && email) {
      fetchUserProfile();
    }
  }, [show, email]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`/api/auth/user?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const user = await response.json();
        setProfileData(prev => ({
          ...prev,
          name: user.name || "",
          email: user.email || email
        }));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords if changing password
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      alert("New passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          currentPassword: profileData.currentPassword || undefined,
          newPassword: profileData.newPassword || undefined
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditModalOpen(false);
        
        // Update local storage if name changed
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.name = profileData.name;
        localStorage.setItem('user', JSON.stringify(user));
        
        // Reset password fields
        setProfileData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }));
      } else {
        alert(data.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditModalOpen(false);
    setProfileData(prev => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }));
  };
  
  if (!show) return null;

  return (
    <>
      {/* Mobile overlay */}
      {show && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`w-80 sm:w-96 bg-white border-l border-gray-200 h-[calc(100vh-4rem)] fixed right-0 top-16 shadow-lg z-50 transform transition-transform duration-300 ${
        show ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        <div className="p-4 sm:p-6">
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold mx-auto mb-3">
                {email.charAt(0).toUpperCase()}
              </div>
              <h4 className="font-semibold text-sm sm:text-base truncate px-2">{email.split('@')[0]}</h4>
              <p className="text-xs sm:text-sm text-gray-500">Premium Customer</p>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-700">Email</p>
                <p className="text-xs sm:text-sm text-gray-600 break-all">{email}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-700">Member Since</p>
                <p className="text-xs sm:text-sm text-gray-600">January 2024</p>
              </div>
            <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm font-medium text-gray-700">Account Type</p>
                <p className="text-xs sm:text-sm text-gray-600">Premium</p>
              </div>
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
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information and password.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="col-span-3"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currentPassword" className="text-right">
                  Current Password
                </Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={profileData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className="col-span-3"
                  placeholder="Enter current password (only if changing password)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="newPassword" className="text-right">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={profileData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="col-span-3"
                  placeholder="Enter new password (optional)"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="confirmPassword" className="text-right">
                  Confirm New Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={profileData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="col-span-3"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Profile"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
