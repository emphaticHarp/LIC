# Calculator Quick Reference Card

## 🎯 Quick Start
1. Click blue calculator button (bottom-right corner)
2. Select tab for your calculation type
3. Enter values and click Calculate
4. Copy results to clipboard

---

## 📊 BASIC TAB
| Button | Function |
|--------|----------|
| 0-9 | Number input |
| . | Decimal point |
| + | Addition |
| − | Subtraction |
| × | Multiplication |
| ÷ | Division |
| % | Percentage |
| x^y | Power |
| +/− | Toggle sign |
| = | Calculate |
| Clear | Reset all |
| ← Back | Delete last digit |

---

## 🔬 SCIENTIFIC TAB

### Trigonometry
| Function | Input | Output |
|----------|-------|--------|
| sin | Angle | Sine value |
| cos | Angle | Cosine value |
| tan | Angle | Tangent value |
| asin | Value | Angle (inverse sine) |
| acos | Value | Angle (inverse cosine) |
| atan | Value | Angle (inverse tangent) |

**Mode**: Toggle between DEG (degrees) and RAD (radians)

### Logarithms
| Function | Input | Output |
|----------|-------|--------|
| log | Number | Log base 10 |
| ln | Number | Natural log |
| e^x | Number | e raised to power |

### Powers & Roots
| Function | Input | Output |
|----------|-------|--------|
| x² | Number | Square |
| x³ | Number | Cube |
| √ | Number | Square root |
| ∛ | Number | Cube root |
| 1/x | Number | Reciprocal |

### Other
| Function | Input | Output |
|----------|-------|--------|
| \|x\| | Number | Absolute value |
| n! | Number | Factorial |
| π | - | Pi (3.14159...) |
| e | - | Euler's number (2.71828...) |

### Memory Functions
| Function | Action |
|----------|--------|
| MC | Clear memory |
| MR | Recall memory |
| M+ | Add to memory |
| M− | Subtract from memory |
| M× | Multiply memory |
| M÷ | Divide memory |

---

## 💰 TOOLS TAB

### Tax Calculator
```
Input: Amount, Tax Rate (%)
Output: Tax amount, Total with tax
Formula: Tax = Amount × Rate / 100
         Total = Amount + Tax
```

### GST Calculator
```
Input: Amount, GST Rate (default 18%)
Output: GST amount, Total with GST
Formula: GST = Amount × Rate / 100
         Total = Amount + GST
```

### Discount Calculator
```
Input: Amount, Discount %
Output: Discount amount, Final price
Formula: Discount = Amount × Percent / 100
         Final = Amount - Discount
```

### EMI Calculator
```
Input: Loan Amount, Interest Rate (p.a.), Duration (months)
Output: Monthly EMI, Total Interest, Total Amount
Formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1)
         where r = monthly rate, n = months
```

### Percentage Calculator
```
Input: Base Value, Value
Output: Percentage
Formula: Percentage = (Value / Base) × 100
```

---

## 🔄 CONVERTER TAB

### Length
- km ↔ miles (1 km = 0.621371 miles)
- m ↔ feet (1 m = 3.28084 feet)
- cm ↔ inches (1 cm = 0.393701 inches)

### Weight
- kg ↔ lbs (1 kg = 2.20462 lbs)
- g ↔ oz (1 g = 0.035274 oz)
- ton ↔ quintal (1 ton = 10 quintals)

### Temperature
- °C ↔ °F: °F = (°C × 9/5) + 32
- °C ↔ K: K = °C + 273.15

### Volume
- L ↔ gallons (1 L = 0.264172 gallons)
- ml ↔ fl oz (1 ml = 0.033814 fl oz)

---

## 📜 HISTORY TAB
- View last 20 calculations
- Shows expression and result
- Click copy icon to copy result
- Clear all history button

---

## 🎨 COLOR CODING

| Color | Meaning |
|-------|---------|
| Blue | Operations (+, −, ×, ÷) |
| Red | Clear/Delete |
| Orange | Backspace |
| Purple | Advanced operations (%, x^y) |
| Green | Equals (=) |
| Gray | Numbers (0-9) |

---

## ⌨️ KEYBOARD SHORTCUTS

| Key | Action |
|-----|--------|
| 0-9 | Number input |
| + | Addition |
| - | Subtraction |
| * | Multiplication |
| / | Division |
| . | Decimal |
| Enter | Calculate (=) |
| Backspace | Delete last digit |
| Escape | Close calculator |

---

## 💡 TIPS & TRICKS

1. **Copy Results**: Click copy icon to copy any result to clipboard
2. **Memory Functions**: Use M+ to accumulate values
3. **Angle Mode**: Switch between DEG and RAD for trigonometry
4. **History**: Check history tab to see all previous calculations
5. **Precision**: Results shown up to 15 decimal places
6. **Currency**: Financial results rounded to 2 decimal places

---

## 🔧 COMMON CALCULATIONS

### Calculate 18% GST on ₹1000
1. Go to Tools tab
2. Select GST Calculator
3. Enter Amount: 1000
4. GST Rate: 18 (default)
5. Click Calculate
6. Result: GST = ₹180, Total = ₹1180

### Calculate EMI for ₹500,000 loan at 8% for 60 months
1. Go to Tools tab
2. Select EMI Calculator
3. Loan Amount: 500000
4. Rate: 8
5. Months: 60
6. Click Calculate
7. Result: Monthly EMI ≈ ₹10,143

### Calculate 15% discount on ₹5000
1. Go to Tools tab
2. Select Discount Calculator
3. Amount: 5000
4. Discount: 15
5. Click Calculate
6. Result: Discount = ₹750, Final = ₹4250

### Calculate sin(45°)
1. Go to Scientific tab
2. Ensure DEG mode is selected
3. Enter: 45
4. Click: sin
5. Result: 0.7071

---

## ❓ FAQ

**Q: Can I use this offline?**
A: Yes! All calculations are done locally.

**Q: Is my calculation history saved?**
A: History is stored during your session. It clears when you refresh the page.

**Q: Can I copy results?**
A: Yes! Click the copy icon next to any result.

**Q: What's the maximum number I can calculate?**
A: JavaScript supports numbers up to 1.79 × 10^308

**Q: Does it support complex numbers?**
A: Currently no, but it's planned for future versions.

**Q: Can I use keyboard input?**
A: Yes! Number keys, operators, and Enter work.

---

## 📞 SUPPORT

For issues or feature requests, please contact the development team.

Last Updated: December 2025
Version: 1.0
