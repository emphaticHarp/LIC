# Scientific Calculator Feature

## Overview
A comprehensive floating calculator has been added to the dashboard with a floating button in the bottom-right corner. When clicked, it opens a modal with multiple calculator modes.

## Files Created

### 1. `components/features/scientific-calculator.tsx`
The main calculator component with four tabs:

#### Basic Calculator Tab
- Standard arithmetic operations: +, −, ×, ÷
- Percentage (%) and Power (x^y) operations
- Decimal support
- Clear button
- Calculation history

#### Scientific Calculator Tab
- **Trigonometric Functions**: sin, cos, tan (in degrees)
- **Logarithmic Functions**: log (base 10), ln (natural log)
- **Power Functions**: x², x³, √x, 1/x
- **Other Functions**: |x| (absolute value), n! (factorial)
- **Memory Functions**: MC (Memory Clear), MR (Memory Recall), M+ (Memory Add), M− (Memory Subtract)

#### Tools Tab
Three specialized calculators:

1. **Tax Calculator**
   - Input: Amount and Tax Rate (%)
   - Output: Tax amount and total with tax
   - Copy to clipboard functionality

2. **GST Calculator**
   - Input: Amount and GST Rate (default 18%)
   - Output: GST amount and total with GST
   - Copy to clipboard functionality

3. **Mobile Recharge Calculator**
   - Input: Recharge amount
   - Automatically calculates 18% GST
   - Output: Amount, GST, and total
   - Copy to clipboard functionality

#### History Tab
- Displays last 10 calculations
- Click any history item to copy to clipboard
- Clear history button

## Files Modified

### `app/dashboard/page.tsx`
- Added import for `FloatingCalculatorButton`
- Added `<FloatingCalculatorButton />` component to the dashboard

### `components/features/floating-calculator-button.tsx`
The floating button component that:
- Displays a calculator icon in the bottom-right corner
- Has a gradient blue background with hover effects
- Shows a tooltip on hover
- Opens/closes the calculator modal
- Responsive design (works on mobile and desktop)

## Features

✅ **Basic Arithmetic**: +, −, ×, ÷, %
✅ **Scientific Functions**: sin, cos, tan, log, ln, sqrt, factorial
✅ **Power Operations**: x², x³, x^y
✅ **Memory Functions**: MC, MR, M+, M−
✅ **Tax Calculations**: Custom tax rate calculator
✅ **GST Calculations**: Indian GST calculator (18% default)
✅ **Mobile Recharge**: Quick recharge with GST calculation
✅ **Calculation History**: Last 10 calculations with copy functionality
✅ **Copy to Clipboard**: All results can be copied with one click
✅ **Responsive Design**: Works on mobile, tablet, and desktop
✅ **Shadcn UI Components**: Uses Button, Input, Card, Tabs from shadcn

## Usage

1. Click the blue calculator button in the bottom-right corner of the dashboard
2. Choose the calculator mode:
   - **Basic**: For everyday calculations
   - **Scientific**: For advanced mathematical operations
   - **Tools**: For tax, GST, and mobile recharge calculations
   - **History**: To view previous calculations
3. Click the X button or click outside to close the calculator

## Styling

- **Floating Button**: Fixed position, bottom-right corner with gradient blue background
- **Modal**: Backdrop blur effect with smooth animations
- **Calculator**: Clean white card design with organized tabs
- **Responsive**: Adapts to mobile (bottom sheet) and desktop (centered modal)

## Technical Details

- Built with React hooks (useState)
- Uses Tailwind CSS for styling
- Shadcn UI components for consistency
- Lucide React icons
- No external calculator libraries (pure JavaScript math)
- Fully typed with TypeScript
