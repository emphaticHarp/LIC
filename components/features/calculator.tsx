"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calculator, Copy, Trash2, RotateCcw } from "lucide-react";

interface CalculatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CalculatorDialog({ open, onOpenChange }: CalculatorDialogProps) {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);
  const [angle, setAngle] = useState<"deg" | "rad">("deg");

  // Tool states
  const [taxAmount, setTaxAmount] = useState("");
  const [taxRate, setTaxRate] = useState("");
  const [taxResult, setTaxResult] = useState<{ tax: number; total: number } | null>(null);

  const [gstAmount, setGstAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [gstResult, setGstResult] = useState<{ gst: number; total: number; withoutGst: number } | null>(null);

  const [discountAmount, setDiscountAmount] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountResult, setDiscountResult] = useState<{ discount: number; final: number } | null>(null);

  const [loanAmount, setLoanAmount] = useState("");
  const [loanRate, setLoanRate] = useState("");
  const [loanMonths, setLoanMonths] = useState("");
  const [loanResult, setLoanResult] = useState<{ emi: number; total: number; interest: number } | null>(null);

  const [percentageBase, setPercentageBase] = useState("");
  const [percentageValue, setPercentageValue] = useState("");
  const [percentageResult, setPercentageResult] = useState<number | null>(null);

  const handleNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".");
      setWaitingForNewValue(false);
    }
  };

  const handleOperation = (op: string) => {
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperation(op);
    setWaitingForNewValue(true);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current;
      case "-":
        return prev - current;
      case "*":
        return prev * current;
      case "/":
        return current !== 0 ? prev / current : 0;
      case "%":
        return prev % current;
      case "^":
        return Math.pow(prev, current);
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const currentValue = parseFloat(display);
      const result = calculate(previousValue, currentValue, operation);
      const expression = `${previousValue} ${operation} ${currentValue}`;
      setHistory([{ expression, result: String(result) }, ...history.slice(0, 19)]);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleScientific = (func: string) => {
    const current = parseFloat(display);
    let result = 0;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    switch (func) {
      case "sin":
        result = angle === "deg" ? Math.sin(toRad(current)) : Math.sin(current);
        break;
      case "cos":
        result = angle === "deg" ? Math.cos(toRad(current)) : Math.cos(current);
        break;
      case "tan":
        result = angle === "deg" ? Math.tan(toRad(current)) : Math.tan(current);
        break;
      case "asin":
        result = angle === "deg" ? toDeg(Math.asin(current)) : Math.asin(current);
        break;
      case "acos":
        result = angle === "deg" ? toDeg(Math.acos(current)) : Math.acos(current);
        break;
      case "atan":
        result = angle === "deg" ? toDeg(Math.atan(current)) : Math.atan(current);
        break;
      case "sqrt":
        result = Math.sqrt(current);
        break;
      case "cbrt":
        result = Math.cbrt(current);
        break;
      case "log":
        result = Math.log10(current);
        break;
      case "ln":
        result = Math.log(current);
        break;
      case "exp":
        result = Math.exp(current);
        break;
      case "1/x":
        result = current !== 0 ? 1 / current : 0;
        break;
      case "x²":
        result = current * current;
        break;
      case "x³":
        result = current * current * current;
        break;
      case "abs":
        result = Math.abs(current);
        break;
      case "!":
        result = factorial(current);
        break;
      case "π":
        result = Math.PI;
        break;
      case "e":
        result = Math.E;
        break;
      default:
        result = current;
    }

    setDisplay(String(result));
    setWaitingForNewValue(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
      result *= i;
    }
    return result;
  };

  const handleMemory = (action: string) => {
    const current = parseFloat(display);
    switch (action) {
      case "MC":
        setMemory(0);
        break;
      case "MR":
        setDisplay(String(memory));
        setWaitingForNewValue(true);
        break;
      case "M+":
        setMemory(memory + current);
        break;
      case "M-":
        setMemory(memory - current);
        break;
      case "M*":
        setMemory(memory * current);
        break;
      case "M/":
        setMemory(current !== 0 ? memory / current : 0);
        break;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Tool calculators
  const calculateTax = () => {
    if (taxAmount && taxRate) {
      const amount = parseFloat(taxAmount);
      const rate = parseFloat(taxRate);
      const tax = (amount * rate) / 100;
      setTaxResult({ tax, total: amount + tax });
    }
  };

  const calculateGST = () => {
    if (gstAmount && gstRate) {
      const amount = parseFloat(gstAmount);
      const rate = parseFloat(gstRate);
      const gst = (amount * rate) / 100;
      setGstResult({ gst, total: amount + gst, withoutGst: amount });
    }
  };

  const calculateDiscount = () => {
    if (discountAmount && discountPercent) {
      const amount = parseFloat(discountAmount);
      const percent = parseFloat(discountPercent);
      const discount = (amount * percent) / 100;
      setDiscountResult({ discount, final: amount - discount });
    }
  };

  const calculateEMI = () => {
    if (loanAmount && loanRate && loanMonths) {
      const principal = parseFloat(loanAmount);
      const rate = parseFloat(loanRate) / 100 / 12;
      const months = parseFloat(loanMonths);
      const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
      const total = emi * months;
      const interest = total - principal;
      setLoanResult({ emi, total, interest });
    }
  };

  const calculatePercentage = () => {
    if (percentageBase && percentageValue) {
      const base = parseFloat(percentageBase);
      const value = parseFloat(percentageValue);
      const result = (value / base) * 100;
      setPercentageResult(result);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Calculator className="w-5 h-5" />
            Advanced Calculator
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full grid grid-cols-5 rounded-none border-b bg-gray-50">
            <TabsTrigger value="basic" className="text-xs">Basic</TabsTrigger>
            <TabsTrigger value="scientific" className="text-xs">Scientific</TabsTrigger>
            <TabsTrigger value="tools" className="text-xs">Tools</TabsTrigger>
            <TabsTrigger value="converter" className="text-xs">Convert</TabsTrigger>
            <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1 overflow-hidden">
            {/* Basic Calculator */}
            <TabsContent value="basic" className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                  type="text"
                  value={display}
                  readOnly
                  className="w-full bg-transparent text-4xl font-bold text-gray-800 text-right outline-none"
                />
              </div>

              <div className="grid grid-cols-4 gap-2">
                <Button onClick={handleClear} variant="outline" className="col-span-2 bg-red-50 hover:bg-red-100 border-red-200">
                  Clear
                </Button>
                <Button onClick={handleBackspace} variant="outline" className="bg-orange-50 hover:bg-orange-100 border-orange-200">
                  ← Back
                </Button>
                <Button onClick={() => handleOperation("/")} variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200 font-semibold">
                  ÷
                </Button>

                <Button onClick={() => handleNumber("7")} variant="outline">7</Button>
                <Button onClick={() => handleNumber("8")} variant="outline">8</Button>
                <Button onClick={() => handleNumber("9")} variant="outline">9</Button>
                <Button onClick={() => handleOperation("*")} variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200 font-semibold">
                  ×
                </Button>

                <Button onClick={() => handleNumber("4")} variant="outline">4</Button>
                <Button onClick={() => handleNumber("5")} variant="outline">5</Button>
                <Button onClick={() => handleNumber("6")} variant="outline">6</Button>
                <Button onClick={() => handleOperation("-")} variant="outline" className="bg-blue-50 hover:bg-blue-100 border-blue-200 font-semibold">
                  −
                </Button>

                <Button onClick={() => handleNumber("1")} variant="outline">1</Button>
                <Button onClick={() => handleNumber("2")} variant="outline">2</Button>
                <Button onClick={() => handleNumber("3")} variant="outline">3</Button>
                <Button onClick={handleEquals} variant="outline" className="bg-green-50 hover:bg-green-100 border-green-200 font-semibold row-span-2">
                  =
                </Button>

                <Button onClick={() => handleNumber("0")} variant="outline" className="col-span-2">
                  0
                </Button>
                <Button onClick={handleDecimal} variant="outline">
                  .
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => handleOperation("%")} variant="outline" className="bg-purple-50 hover:bg-purple-100 border-purple-200">
                  %
                </Button>
                <Button onClick={() => handleOperation("^")} variant="outline" className="bg-purple-50 hover:bg-purple-100 border-purple-200">
                  x^y
                </Button>
                <Button onClick={() => setDisplay(String(-parseFloat(display)))} variant="outline" className="bg-purple-50 hover:bg-purple-100 border-purple-200">
                  +/−
                </Button>
              </div>
            </TabsContent>

            {/* Scientific Calculator */}
            <TabsContent value="scientific" className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-4 rounded-lg border border-gray-200">
                <input
                  type="text"
                  value={display}
                  readOnly
                  className="w-full bg-transparent text-4xl font-bold text-gray-800 text-right outline-none"
                />
              </div>

              <div className="flex gap-2 mb-4">
                <Badge variant={angle === "deg" ? "default" : "outline"} className="cursor-pointer" onClick={() => setAngle("deg")}>
                  DEG
                </Badge>
                <Badge variant={angle === "rad" ? "default" : "outline"} className="cursor-pointer" onClick={() => setAngle("rad")}>
                  RAD
                </Badge>
                {memory !== 0 && <Badge variant="secondary">M: {memory.toFixed(2)}</Badge>}
              </div>

              <div className="grid grid-cols-6 gap-2">
                <Button onClick={() => handleMemory("MC")} size="sm" variant="outline" className="text-xs">MC</Button>
                <Button onClick={() => handleMemory("MR")} size="sm" variant="outline" className="text-xs">MR</Button>
                <Button onClick={() => handleMemory("M+")} size="sm" variant="outline" className="text-xs">M+</Button>
                <Button onClick={() => handleMemory("M-")} size="sm" variant="outline" className="text-xs">M−</Button>
                <Button onClick={() => handleMemory("M*")} size="sm" variant="outline" className="text-xs">M×</Button>
                <Button onClick={() => handleMemory("M/")} size="sm" variant="outline" className="text-xs">M÷</Button>
              </div>

              <Separator />

              <div className="grid grid-cols-6 gap-2">
                <Button onClick={() => handleScientific("sin")} size="sm" variant="outline" className="text-xs">sin</Button>
                <Button onClick={() => handleScientific("cos")} size="sm" variant="outline" className="text-xs">cos</Button>
                <Button onClick={() => handleScientific("tan")} size="sm" variant="outline" className="text-xs">tan</Button>
                <Button onClick={() => handleScientific("asin")} size="sm" variant="outline" className="text-xs">asin</Button>
                <Button onClick={() => handleScientific("acos")} size="sm" variant="outline" className="text-xs">acos</Button>
                <Button onClick={() => handleScientific("atan")} size="sm" variant="outline" className="text-xs">atan</Button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                <Button onClick={() => handleScientific("sqrt")} size="sm" variant="outline" className="text-xs">√</Button>
                <Button onClick={() => handleScientific("cbrt")} size="sm" variant="outline" className="text-xs">∛</Button>
                <Button onClick={() => handleScientific("log")} size="sm" variant="outline" className="text-xs">log</Button>
                <Button onClick={() => handleScientific("ln")} size="sm" variant="outline" className="text-xs">ln</Button>
                <Button onClick={() => handleScientific("exp")} size="sm" variant="outline" className="text-xs">e^x</Button>
                <Button onClick={() => handleScientific("!")} size="sm" variant="outline" className="text-xs">n!</Button>
              </div>

              <div className="grid grid-cols-6 gap-2">
                <Button onClick={() => handleScientific("x²")} size="sm" variant="outline" className="text-xs">x²</Button>
                <Button onClick={() => handleScientific("x³")} size="sm" variant="outline" className="text-xs">x³</Button>
                <Button onClick={() => handleScientific("1/x")} size="sm" variant="outline" className="text-xs">1/x</Button>
                <Button onClick={() => handleScientific("abs")} size="sm" variant="outline" className="text-xs">|x|</Button>
                <Button onClick={() => handleScientific("π")} size="sm" variant="outline" className="text-xs">π</Button>
                <Button onClick={() => handleScientific("e")} size="sm" variant="outline" className="text-xs">e</Button>
              </div>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools" className="p-6 space-y-6">
              {/* Tax Calculator */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Badge>Tax</Badge>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Amount" value={taxAmount} onChange={(e) => setTaxAmount(e.target.value)} />
                  <Input type="number" placeholder="Rate %" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                </div>
                <Button onClick={calculateTax} className="w-full">Calculate Tax</Button>
                {taxResult && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span className="font-semibold">₹{taxResult.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total:</span>
                      <span className="text-blue-600">₹{taxResult.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* GST Calculator */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Badge>GST</Badge>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Amount" value={gstAmount} onChange={(e) => setGstAmount(e.target.value)} />
                  <Input type="number" placeholder="GST %" value={gstRate} onChange={(e) => setGstRate(e.target.value)} />
                </div>
                <Button onClick={calculateGST} className="w-full">Calculate GST</Button>
                {gstResult && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Amount:</span>
                      <span>₹{gstResult.withoutGst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>GST:</span>
                      <span>₹{gstResult.gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total:</span>
                      <span className="text-green-600">₹{gstResult.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Discount Calculator */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Badge>Discount</Badge>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Amount" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} />
                  <Input type="number" placeholder="Discount %" value={discountPercent} onChange={(e) => setDiscountPercent(e.target.value)} />
                </div>
                <Button onClick={calculateDiscount} className="w-full">Calculate Discount</Button>
                {discountResult && (
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Discount:</span>
                      <span>₹{discountResult.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Final Price:</span>
                      <span className="text-orange-600">₹{discountResult.final.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* EMI Calculator */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Badge>EMI</Badge>
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <Input type="number" placeholder="Loan Amount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} />
                  <Input type="number" placeholder="Rate % p.a." value={loanRate} onChange={(e) => setLoanRate(e.target.value)} />
                  <Input type="number" placeholder="Months" value={loanMonths} onChange={(e) => setLoanMonths(e.target.value)} />
                </div>
                <Button onClick={calculateEMI} className="w-full">Calculate EMI</Button>
                {loanResult && (
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-200 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Monthly EMI:</span>
                      <span className="font-semibold">₹{loanResult.emi.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Interest:</span>
                      <span>₹{loanResult.interest.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-purple-600">₹{loanResult.total.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Percentage Calculator */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Badge>Percentage</Badge>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" placeholder="Base Value" value={percentageBase} onChange={(e) => setPercentageBase(e.target.value)} />
                  <Input type="number" placeholder="Value" value={percentageValue} onChange={(e) => setPercentageValue(e.target.value)} />
                </div>
                <Button onClick={calculatePercentage} className="w-full">Calculate %</Button>
                {percentageResult !== null && (
                  <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                    <div className="flex justify-between text-sm font-semibold">
                      <span>Percentage:</span>
                      <span className="text-indigo-600">{percentageResult.toFixed(2)}%</span>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Converter Tab */}
            <TabsContent value="converter" className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Length</h3>
                  <Button variant="outline" className="w-full text-xs">km ↔ miles</Button>
                  <Button variant="outline" className="w-full text-xs">m ↔ feet</Button>
                  <Button variant="outline" className="w-full text-xs">cm ↔ inches</Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Weight</h3>
                  <Button variant="outline" className="w-full text-xs">kg ↔ lbs</Button>
                  <Button variant="outline" className="w-full text-xs">g ↔ oz</Button>
                  <Button variant="outline" className="w-full text-xs">ton ↔ quintal</Button>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Temperature</h3>
                  <Button variant="outline" className="w-full text-xs">°C ↔ °F</Button>
                  <Button variant="outline" className="w-full text-xs">°C ↔ K</Button>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Volume</h3>
                  <Button variant="outline" className="w-full text-xs">L ↔ gallons</Button>
                  <Button variant="outline" className="w-full text-xs">ml ↔ fl oz</Button>
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history" className="p-6 space-y-3">
              {history.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">No calculation history</p>
              ) : (
                <>
                  <div className="space-y-2">
                    {history.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                        <div className="flex-1">
                          <p className="text-xs text-gray-600">{item.expression}</p>
                          <p className="text-sm font-semibold text-gray-800">{item.result}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(item.result)}
                          className="ml-2"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => setHistory([])}
                    variant="outline"
                    className="w-full text-xs"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear History
                  </Button>
                </>
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
