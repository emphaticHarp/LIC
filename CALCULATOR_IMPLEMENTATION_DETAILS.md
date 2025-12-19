# Calculator Implementation Details

## Component Architecture

```
FloatingCalculator (floating-calculator.tsx)
├── Button (shadcn)
│   └── Calculator Icon (lucide-react)
└── CalculatorDialog (calculator.tsx)
    ├── DialogContent (shadcn)
    │   ├── DialogHeader
    │   │   └── DialogTitle
    │   └── Tabs (shadcn)
    │       ├── TabsList
    │       ├── TabsContent (Basic)
    │       ├── TabsContent (Scientific)
    │       ├── TabsContent (Tools)
    │       ├── TabsContent (Converter)
    │       └── TabsContent (History)
    └── ScrollArea (shadcn)
```

## State Management

### Calculator State
```typescript
const [display, setDisplay] = useState("0");
const [previousValue, setPreviousValue] = useState<number | null>(null);
const [operation, setOperation] = useState<string | null>(null);
const [waitingForNewValue, setWaitingForNewValue] = useState(false);
const [memory, setMemory] = useState(0);
const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);
const [angle, setAngle] = useState<"deg" | "rad">("deg");
```

### Tool States
```typescript
// Tax Calculator
const [taxAmount, setTaxAmount] = useState("");
const [taxRate, setTaxRate] = useState("");
const [taxResult, setTaxResult] = useState<{ tax: number; total: number } | null>(null);

// GST Calculator
const [gstAmount, setGstAmount] = useState("");
const [gstRate, setGstRate] = useState("18");
const [gstResult, setGstResult] = useState<{ gst: number; total: number; withoutGst: number } | null>(null);

// Discount Calculator
const [discountAmount, setDiscountAmount] = useState("");
const [discountPercent, setDiscountPercent] = useState("");
const [discountResult, setDiscountResult] = useState<{ discount: number; final: number } | null>(null);

// EMI Calculator
const [loanAmount, setLoanAmount] = useState("");
const [loanRate, setLoanRate] = useState("");
const [loanMonths, setLoanMonths] = useState("");
const [loanResult, setLoanResult] = useState<{ emi: number; total: number; interest: number } | null>(null);

// Percentage Calculator
const [percentageBase, setPercentageBase] = useState("");
const [percentageValue, setPercentageValue] = useState("");
const [percentageResult, setPercentageResult] = useState<number | null>(null);
```

## Core Functions

### Basic Operations
```typescript
const calculate = (prev: number, current: number, op: string): number => {
  switch (op) {
    case "+": return prev + current;
    case "-": return prev - current;
    case "*": return prev * current;
    case "/": return current !== 0 ? prev / current : 0;
    case "%": return prev % current;
    case "^": return Math.pow(prev, current);
    default: return current;
  }
};
```

### Scientific Functions
```typescript
const handleScientific = (func: string) => {
  const current = parseFloat(display);
  let result = 0;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const toDeg = (rad: number) => (rad * 180) / Math.PI;

  switch (func) {
    case "sin": result = angle === "deg" ? Math.sin(toRad(current)) : Math.sin(current); break;
    case "cos": result = angle === "deg" ? Math.cos(toRad(current)) : Math.cos(current); break;
    case "tan": result = angle === "deg" ? Math.tan(toRad(current)) : Math.tan(current); break;
    case "asin": result = angle === "deg" ? toDeg(Math.asin(current)) : Math.asin(current); break;
    case "acos": result = angle === "deg" ? toDeg(Math.acos(current)) : Math.acos(current); break;
    case "atan": result = angle === "deg" ? toDeg(Math.atan(current)) : Math.atan(current); break;
    case "sqrt": result = Math.sqrt(current); break;
    case "cbrt": result = Math.cbrt(current); break;
    case "log": result = Math.log10(current); break;
    case "ln": result = Math.log(current); break;
    case "exp": result = Math.exp(current); break;
    case "1/x": result = current !== 0 ? 1 / current : 0; break;
    case "x²": result = current * current; break;
    case "x³": result = current * current * current; break;
    case "abs": result = Math.abs(current); break;
    case "!": result = factorial(current); break;
    case "π": result = Math.PI; break;
    case "e": result = Math.E; break;
  }

  setDisplay(String(result));
  setWaitingForNewValue(true);
};
```

### Memory Functions
```typescript
const handleMemory = (action: string) => {
  const current = parseFloat(display);
  switch (action) {
    case "MC": setMemory(0); break;
    case "MR": setDisplay(String(memory)); setWaitingForNewValue(true); break;
    case "M+": setMemory(memory + current); break;
    case "M-": setMemory(memory - current); break;
    case "M*": setMemory(memory * current); break;
    case "M/": setMemory(current !== 0 ? memory / current : 0); break;
  }
};
```

### Financial Calculators

#### Tax Calculator
```typescript
const calculateTax = () => {
  if (taxAmount && taxRate) {
    const amount = parseFloat(taxAmount);
    const rate = parseFloat(taxRate);
    const tax = (amount * rate) / 100;
    setTaxResult({ tax, total: amount + tax });
  }
};
```

#### GST Calculator
```typescript
const calculateGST = () => {
  if (gstAmount && gstRate) {
    const amount = parseFloat(gstAmount);
    const rate = parseFloat(gstRate);
    const gst = (amount * rate) / 100;
    setGstResult({ gst, total: amount + gst, withoutGst: amount });
  }
};
```

#### EMI Calculator
```typescript
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
```

## Shadcn Components Used

| Component | Purpose | Location |
|-----------|---------|----------|
| Dialog | Main modal container | calculator.tsx |
| DialogContent | Modal content wrapper | calculator.tsx |
| DialogHeader | Modal header section | calculator.tsx |
| DialogTitle | Modal title | calculator.tsx |
| Tabs | Tab navigation | calculator.tsx |
| TabsList | Tab list container | calculator.tsx |
| TabsContent | Tab content panels | calculator.tsx |
| Button | All interactive buttons | calculator.tsx, floating-calculator.tsx |
| Input | Text input fields | calculator.tsx |
| Badge | Status indicators | calculator.tsx |
| ScrollArea | Scrollable content | calculator.tsx |
| Separator | Visual dividers | calculator.tsx |

## Styling Classes

### Color Schemes
```css
/* Operations */
.bg-blue-50 .hover:bg-blue-100 .border-blue-200

/* Clear/Delete */
.bg-red-50 .hover:bg-red-100 .border-red-200

/* Backspace */
.bg-orange-50 .hover:bg-orange-100 .border-orange-200

/* Advanced */
.bg-purple-50 .hover:bg-purple-100 .border-purple-200

/* Equals */
.bg-green-50 .hover:bg-green-100 .border-green-200
```

### Responsive Design
```css
/* Grid layouts */
grid-cols-4 gap-2    /* Basic calculator buttons */
grid-cols-6 gap-2    /* Scientific buttons */
grid-cols-2 gap-2    /* Tool inputs */
grid-cols-3 gap-2    /* EMI inputs */

/* Responsive text */
text-4xl             /* Display */
text-sm              /* Labels */
text-xs              /* Small buttons */
```

## Integration with Dashboard

### Import
```typescript
import { FloatingCalculator } from "@/components/features/floating-calculator";
```

### Usage
```typescript
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
  <FloatingCalculator />
  {/* Rest of dashboard */}
</div>
```

## Performance Optimizations

1. **Local Calculations**: All math done client-side, no API calls
2. **Memoization**: State updates only when necessary
3. **Lazy Rendering**: Tabs only render when active
4. **Efficient History**: Limited to 20 items to prevent memory bloat
5. **No External Libraries**: Pure JavaScript Math library

## Browser Compatibility

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- Mobile browsers: ✓ Full support

## Accessibility Features

- ARIA labels on all buttons
- Keyboard navigation support
- High contrast colors
- Clear visual feedback
- Screen reader friendly
- Semantic HTML structure

## Future Enhancement Opportunities

1. **Keyboard Input**: Support number pad and operator keys
2. **Dark Mode**: Theme toggle for dark theme
3. **More Converters**: Add more unit conversion options
4. **Calculation Templates**: Save frequently used calculations
5. **Export History**: Download calculation history as CSV
6. **Voice Input**: Speech-to-text for calculations
7. **Graphing**: Plot functions and equations
8. **Matrix Operations**: Matrix calculations
9. **Complex Numbers**: Support for complex number arithmetic
10. **Persistent History**: Save history to localStorage

## Testing Recommendations

1. Test all basic operations (+, −, ×, ÷)
2. Test scientific functions with DEG/RAD modes
3. Test memory functions (MC, MR, M+, M−, M×, M÷)
4. Test all financial calculators with various inputs
5. Test history functionality and copy-to-clipboard
6. Test responsive design on mobile devices
7. Test keyboard navigation
8. Test with screen readers for accessibility

## Deployment Notes

- No environment variables required
- No external API dependencies
- No database requirements
- Works offline
- No build-time configuration needed
- Compatible with Next.js 16+
- Works with React 19+
