"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
  label: string;
  href?: string;
}

const breadcrumbMap: { [key: string]: BreadcrumbItemType[] } = {
  "/": [{ label: "Home" }],
  "/dashboard": [{ label: "Home", href: "/" }, { label: "Dashboard" }],
  "/policies": [{ label: "Home", href: "/" }, { label: "Policies" }],
  "/claims": [{ label: "Home", href: "/" }, { label: "Claims" }],
  "/customers": [{ label: "Home", href: "/" }, { label: "Customers" }],
  "/loans": [{ label: "Home", href: "/" }, { label: "Loans" }],
  "/payments": [{ label: "Home", href: "/" }, { label: "Payments" }],
  "/commission": [{ label: "Home", href: "/" }, { label: "Commission" }],
  "/collections": [{ label: "Home", href: "/" }, { label: "Collections" }],
  "/reports": [{ label: "Home", href: "/" }, { label: "Reports" }],
  "/analysis": [{ label: "Home", href: "/" }, { label: "Analysis" }],
  "/settings": [{ label: "Home", href: "/" }, { label: "Settings" }],
  "/help": [{ label: "Home", href: "/" }, { label: "Help" }],
  "/agent-management": [{ label: "Home", href: "/" }, { label: "Agent Management" }],
  "/agents": [{ label: "Home", href: "/" }, { label: "Agents" }],
  "/integrations": [{ label: "Home", href: "/" }, { label: "Integrations" }],
  "/register": [{ label: "Register" }],
  "/forgot-password": [{ label: "Forgot Password" }],
  "/reset-password": [{ label: "Reset Password" }],
  "/verify": [{ label: "Verify" }],
  "/new-policy": [{ label: "Home", href: "/" }, { label: "New Policy" }],
};

export function BreadcrumbNav() {
  const pathname = usePathname();
  const items = breadcrumbMap[pathname] || [{ label: "Page" }];

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
