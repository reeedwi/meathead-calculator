# **Product Requirements Document: Meathead Calculator**

## **Overview**

The *Meathead Calculator* is a minimalist, single-screen web application designed to instantly calculate the amount of weight to load on each side of a standard Olympic barbell. It is built for convenience, simplicity, and speed — optimized for use on both web and mobile platforms as a Progressive Web App (PWA).

## **Problem Statement**

Lifters often waste time or make mistakes trying to calculate how much weight to load on each side of the barbell. This is especially true during intense workouts, when both focus and math skills are in short supply.

## **Solution**

The Meathead Calculator eliminates the need for mental math. Users input the total desired barbell weight, and the app immediately displays the correct plate load per side using the formula:

```
(side_weight) = (input_weight - 45) / 2
```

This calculation assumes a standard 45 lb Olympic bar.

## **Key Features**

- **Single Input Field:** Accepts numeric input (0–999). Only digits are allowed.
- **Real-Time Calculation:** The result updates immediately as the user types.
- **Minimal UI:** Just a title, a short description, an input, and the result.
- **Responsive Design:** Optimized for both mobile and desktop.
- **Progressive Web App (PWA):** Installable on phones and computers.
- **Accessibility-Focused:** Large, easy-to-read text and buttons.
- **Color Scheme:** Black text on a white background for maximum contrast and clarity.

## **User Interface**

### **Screen Layout**

- **Title:** `Meathead Calculator` — Centered, bold, large font.
- **Description Text:**
  > "You don't have time to do math! Or the ability! Just enter in your weight and find out what you need on each side of the bar."
- **Input Field:**
  - Numeric only
  - Max: 999
  - Center-aligned
  - Large size for touch friendliness
- **Output Field:**
  - Dynamically displays:
    - "Put **X lbs** on each side of the bar."
  - Large, bold font
  - Updates in real-time

## **Technical Requirements**

- **Framework:** Vanilla JS, React, or any modern lightweight front-end stack.
- **PWA Features:**
  - Installable
  - Offline support
  - Responsive design
- **Validation:**
  - Ensure input is numeric and within a realistic range.
  - Prevent calculation for weights under 45 lb (show a helpful message like "Weight must be at least 45 lb").

## **Design Requirements**

- **Visual Style:**
  - Monochrome (black and white)
  - Clean, utilitarian design
  - High readability
- **Font:** Sans-serif, bold for key elements
- **Accessibility:** Sufficient contrast, large touch targets, ARIA labels where applicable

## **Example**

- **Input:** `225`
- **Calculation:** `(225 - 45) / 2 = 90`
- **Output:** `Put 90 lbs on each side of the bar.`
---
# **New Features**
## **New Feature: Plate Inventory & Automatic Plate Breakdown**

### **Overview**

To enhance the utility of the Meathead Calculator, users will now have the ability to specify their available weight plates. This allows the app to not only calculate the required weight per side but also suggest the exact combination of plates to use — ensuring the user can actually load the weight with their available equipment.

### **Functionality**

- **Plate Inventory Input:**
  - A new section on the screen will list standard plate sizes:
    - 45 lb, 25 lb, 15 lb, 10 lb, 5 lb, 2.5 lb
  - For each plate size, there will be an input field where the user can specify how many of that plate they own.
  - All inputs accept only whole numbers (0 or more).

- **Plate Breakdown Logic:**
  - After calculating the required weight per side, the app determines the optimal combination of plates to reach that number using the available inventory.
  - If the exact weight cannot be matched with the available plates, a message will alert the user (e.g., "Unable to make 90 lbs with your available plates.").

### **User Interface & Design**

- **Consistency:** This section follows the same clean, monochrome style as the rest of the app (white background, black text, bold fonts).
- **Layout:**
  - Each plate size is listed in descending order (starting with 45 lb).
  - Next to each plate size is a clearly labeled numeric input field for quantity.
  - Fields are large, touch-friendly, and center-aligned.

### **Example**

- **Input:**
  - Desired Total Weight: 225 lb
  - Available Plates: 
    - 45 lb: 2
    - 25 lb: 2
    - 15 lb: 0
    - 10 lb: 2
    - 5 lb: 2
    - 2.5 lb: 2
- **Output:**
  - Required per side: 90 lb
  - Suggested Plates: 1 x 45 lb, 1 x 25 lb, 1 x 10 lb, 1 x 5 lb, 1 x 2.5 lb (per side)

## **New Feature: Percentage Breakdown Display**

### **Overview**

We are enhancing the existing calculator functionality by adding a new section that dynamically displays percentage breakdowns of the input value. This feature aims to provide users with quick reference points for key percentage values, making it especially useful in scenarios such as weightlifting, budgeting, or comparative analysis.

### **Problem Statement**

Currently, the calculator accepts a numeric input but does not offer any native insight into how this value scales across common percentage thresholds. Users needing to calculate specific percentage values (e.g., 95%, 90%) must do so manually or using external tools.

### **Objective**

Introduce a built-in percentage breakdown section that automatically displays decremental percentages of the user's input value, from 95% to 50%, in 5% increments.

### **Functional Requirements**

**Trigger:** When a user enters a value into the calculator's main input field.

**Behavior:**
- Automatically calculate and display the values for:
  - 95%
  - 90%
  - 85%
  - 80%
  - 75%
  - 70%
  - 65%
  - 60%
  - 55%
  - 50%

Each percentage should be listed with a clear label (e.g., "95% of 400 = 380").

**Layout:**
- Display the breakdown in a new section below or next to the main result.
- Values should be presented in a vertical list or grid format for easy scanning.

**Precision:**
- Calculated values should be rounded to 2 decimal places unless otherwise configured.

**Accessibility:**
- Ensure the percentage breakdown is readable via screen readers and formatted for mobile responsiveness.

### **Non-Functional Requirements**

**Performance:** The calculation must be instant, with no noticeable delay upon input.

**Scalability:** Future percentage ranges (e.g., 100%-0% in 10% steps) should be easy to implement using this model.

**Internationalization:** Values should respect locale-based formatting (e.g., comma vs. period decimal separator).

### **Example**

**User Input:** 400

**Output Section:**
```
95% of 400 = 380
90% of 400 = 360
85% of 400 = 340
80% of 400 = 320
75% of 400 = 300
70% of 400 = 280
65% of 400 = 260
60% of 400 = 240
55% of 400 = 220
50% of 400 = 200
```

## **New Feature: Clickable Percentage Breakdown**

### **Overview**

Enhance the percentage breakdown section by making each percentage value box interactive. Users can click any percentage box to instantly set the main input to that value, allowing for quick recalculation of all outputs (percentages, plate suggestions, etc.).

### **Problem Statement**

Currently, users can view percentage breakdowns but must manually re-enter a value if they want to use a specific percentage for further calculations. This is inefficient, especially for lifters who want to quickly see the setup for a specific percentage of their 1RM or working weight.

### **Objective**

Allow users to click any percentage breakdown box to set the main input to that value and automatically update all calculations.

### **Functional Requirements**
- Each percentage breakdown box is clickable (keyboard and screen reader accessible).
- Clicking a box sets the main input value to the value shown in that box (e.g., clicking "85% of 400 = 340" sets the input to 340).
- All calculations (percentages, plate breakdown, etc.) update instantly based on the new value.
- Visual feedback (e.g., hover/focus effect) is provided for interactivity.
- The feature is accessible for keyboard and screen readers.

### **Non-Functional Requirements**
- No page reloads or flicker.
- Works on both desktop and mobile.
- Maintains accessibility and responsiveness.

### **Example**
- User enters: `400` (1RM)
- Sees: `85% of 400 = 340`
- Clicks the `340` box
- Input changes to `340`, all outputs update to reflect calculations for `340`