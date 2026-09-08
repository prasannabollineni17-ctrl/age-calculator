# ⏱️ Age & Date Calculator

A modern, responsive web application for calculating precise age breakdowns, total calendar days lived, upcoming birthday countdowns, and age projections on future dates.

---

## 🌟 Features

- 🎂 **Precise Age Calculation**: Exact breakdown into **Years, Months, and Days**, accurately handling leap years and varying month lengths.
- 📅 **Total Days Lived**: Live count of total calendar days lived, plus weeks, hours, and minutes.
- 🔮 **Age on Future (or Past) Date**: Flexible "Selected Date" input with quick presets (`+1 Year`, `+5 Years`, `+10 Years`, `Age 60`, `Year 2030`, `Year 2050`).
- 🎂 **Next Birthday Countdown**:
  - Days remaining until next birthday.
  - Day of the week it falls on (e.g. Saturday, Sunday).
  - Celebration banner if today is the user's birthday! 🎉
- 🌟 **Insights**:
  - Accurate Western Tropical Zodiac sign with date ranges & symbols.
  - Exact day of the week born on.
- 🌓 **Dark & Light Mode**: Seamless theme switching with saved preference.
- 📋 **One-Click Copy**: Copy a clean text breakdown summary to clipboard.
- 📱 **Fully Responsive**: Mobile, tablet, and desktop optimized.

---

## 🚀 How to Run

Simply open `index.html` in any web browser:

1. Double-click [index.html](file:///c:/Users/venka/OneDrive/Documents/Age%20calculator/index.html) in your file explorer.
2. Or serve it locally using any static server or Python:
   ```powershell
   # Optional: run local server
   python -m http.server 8000
   ```
   and navigate to `http://localhost:8000`.

---

## 🧪 Running Automated Tests

A comprehensive unit test suite is included to verify leap year handling, month transitions, and edge cases:

```powershell
node test_calculations.js
```
