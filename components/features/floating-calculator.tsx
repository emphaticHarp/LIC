"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { CalculatorDialog } from "./calculator";

export function FloatingCalculator() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="lg"
        className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 group"
        title="Open Calculator"
      >
        <Calculator className="w-6 h-6" />
        <span className="absolute bottom-full mb-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Advanced Calculator
        </span>
      </Button>

      <CalculatorDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
