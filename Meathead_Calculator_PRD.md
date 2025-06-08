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
  > “You don’t have time to do math! Or the ability! Just enter in your weight and find out what you need on each side of the bar.”
- **Input Field:**
  - Numeric only
  - Max: 999
  - Center-aligned
  - Large size for touch friendliness
- **Output Field:**
  - Dynamically displays:
    - “Put **X lbs** on each side of the bar.”
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
  - Prevent calculation for weights under 45 lb (show a helpful message like “Weight must be at least 45 lb”).

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
