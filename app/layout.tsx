import type { Metadata } from "next";
import "./globals.css";
import ReduxProvider from "@/components/providers/ReduxProvider";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "LIC Login - Life Insurance Corporation of India",
  description: "Secure login portal for LIC account holders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ReduxProvider>
          {children}
        </ReduxProvider>
        <Analytics />
      </body>
    </html>
  );
}
