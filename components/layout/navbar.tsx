"use client";

// Navbar component for LIC application
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarTrigger } from "@/components/ui/menubar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
  email: string;
  currentPage: string;
  showProfileSidebar: boolean;
  setShowProfileSidebar: (show: boolean) => void;
  notifications: any[];
  setNotifications: (notifications: any[]) => void;
  isClearingNotifications: boolean;
  setIsClearingNotifications: (loading: boolean) => void;
}

export default function Navbar({
  email,
  currentPage,
  showProfileSidebar,
  setShowProfileSidebar,
  notifications,
  setNotifications,
  isClearingNotifications,
  setIsClearingNotifications
}: NavbarProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      // Clear user from localStorage
      localStorage.removeItem('user');
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoading(false);
    }
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleClearAll = async () => {
    setIsClearingNotifications(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setNotifications([]);
    setIsClearingNotifications(false);
  };

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: "Dashboard", path: "dashboard", active: currentPage === "dashboard" },
    { name: "Policies", path: "policies", active: currentPage === "policies" },
    { name: "Claims", path: "claims", active: currentPage === "claims" },
    { name: "Customers", path: "customers", active: currentPage === "customers" }
  ];

  const dropdownItems = [
    { name: "New Policy", path: "new-policy", active: currentPage === "new-policy" },
    { name: "Commission", path: "commission", active: currentPage === "commission" },
    { name: "Collections", path: "collections", active: currentPage === "collections" },
    { name: "Agents", path: "agents", active: currentPage === "agents" },
    { name: "Help", path: "help", active: currentPage === "help" }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex items-center">
              <Image
                src="https://1000logos.net/wp-content/uploads/2021/08/LIC-Logo.jpg"
                alt="LIC Logo"
                width={40}
                height={40}
                className="rounded-lg shadow-sm"
                priority
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold text-blue-600 leading-tight truncate max-w-[120px] sm:max-w-none">{email.split('@')[0]}</h1>
              <p className="text-xs text-gray-500 leading-none hidden sm:block">Life Insurance Corporation</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path === "#" ? "#" : email ? `/${item.path}?email=${encodeURIComponent(email)}` : `/${item.path}`}
                className={`font-medium transition-colors text-sm ${
                  item.active
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {item.name}
              </a>
            ))}
            
            {/* More Dropdown */}
            <Menubar className="border-none bg-transparent shadow-none p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className={`font-medium transition-colors flex items-center space-x-1 text-sm ${
                  dropdownItems.some(item => item.active) 
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1" 
                    : "text-gray-700 hover:text-blue-600"
                }`}>
                  <span>More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </MenubarTrigger>
                <MenubarContent align="center" className="w-48">
                  {dropdownItems.map((item) => (
                    <MenubarItem key={item.name} onClick={() => router.push(`/${item.path}?email=${encodeURIComponent(email)}`)}>
                      <div className={`flex items-center w-full ${
                        item.active ? "text-blue-600" : "text-gray-700"
                      }`}>
                        {item.name}
                        {item.active && (
                          <svg className="w-4 h-4 ml-auto text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </MenubarItem>
                  ))}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Profile Section - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications Dropdown */}
            <Menubar className="border-none bg-transparent shadow-none p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </MenubarTrigger>
                <MenubarContent align="end" className="w-80">
                  <div className="px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <span className="text-xs text-gray-500">{unreadCount} unread</span>
                    </div>
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="px-2 py-2 border-b border-gray-200">
                      <div className="flex gap-2">
                        <button
                          onClick={handleMarkAllAsRead}
                          className="flex-1 text-xs bg-blue-50 text-blue-600 px-2 py-1.5 rounded hover:bg-blue-100 transition-colors"
                        >
                          Mark All Read
                        </button>
                        <button
                          onClick={handleClearAll}
                          className="flex-1 text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded hover:bg-red-100 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                  
                  <div className="max-h-96 overflow-y-auto">
                    {isClearingNotifications ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm">Clearing notifications...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm">No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                              !notification.read ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${
                                !notification.read ? 'text-gray-900' : 'text-gray-600'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        View All Notifications
                      </button>
                    </div>
                  )}
                </MenubarContent>
              </MenubarMenu>
            </Menubar>

            {/* Profile Dropdown */}
            <Menubar className="border-none bg-transparent shadow-none p-0 h-auto">
              <MenubarMenu>
                <MenubarTrigger className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                    {email.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {email.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500">Premium Customer</p>
                  </div>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </MenubarTrigger>
                <MenubarContent align="end" className="w-48">
                  <div className="px-2 py-1.5 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900 truncate">{email}</p>
                    <p className="text-xs text-gray-500">Premium Customer</p>
                  </div>
                  <MenubarItem onClick={() => setShowProfileSidebar(true)}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </div>
                  </MenubarItem>
                  <MenubarItem onClick={() => router.push(`/settings?email=${encodeURIComponent(email)}`)}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </div>
                  </MenubarItem>
                  <MenubarItem>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Documents
                    </div>
                  </MenubarItem>
                  <MenubarSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors text-red-600 focus:bg-red-50 focus:text-red-600 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isLoading ? "Logging out..." : "Logout"}
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will be redirected to the login page and will need to sign in again to access your dashboard.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogout} disabled={isLoading}>
                          {isLoading ? "Logging out..." : "Logout"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Mobile Profile */}
            <button className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
              {email.charAt(0).toUpperCase()}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Main Navigation Items */}
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path === "#" ? "#" : email ? `/${item.path}?email=${encodeURIComponent(email)}` : `/${item.path}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    item.active
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Dropdown Items */}
              <div className="pt-2 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">More</p>
                {dropdownItems.map((item) => (
                  <a
                    key={item.name}
                    href={`/${item.path}?email=${encodeURIComponent(email)}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      item.active
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              {/* Mobile Profile Actions */}
              <div className="pt-2 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</p>
                <button
                  onClick={() => {
                    setShowProfileSidebar(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Profile
                </button>
                <a
                  href={`/settings?email=${encodeURIComponent(email)}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Settings
                </a>
                <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">
                  Documents
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
