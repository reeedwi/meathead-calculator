# Meathead Calculator

A minimalist Progressive Web App (PWA) that instantly calculates the weight to load on each side of a standard Olympic barbell. Built for convenience, simplicity, and speed.

## Features

- **Instant Calculation**: Real-time updates as you type
- **Simple Interface**: Just enter the total weight and get the result
- **Progressive Web App**: Installable on mobile and desktop
- **Offline Support**: Works without internet connection once installed
- **Accessible Design**: High contrast, large touch targets, screen reader friendly
- **Responsive**: Optimized for both mobile and desktop use

## How It Works

1. Enter your desired total barbell weight
2. The app calculates: `(total_weight - 45) / 2 = weight_per_side`
3. Assumes a standard 45 lb Olympic barbell
4. Shows exactly how much weight to put on each side

## Example

- **Input**: 225 lbs
- **Calculation**: (225 - 45) ÷ 2 = 90 lbs
- **Output**: "Put 90 lbs on each side of the bar."

## Running the App

### Option 1: Local Server (Recommended for PWA features)

1. **Using Python (if installed):**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```

2. **Using Node.js (if installed):**
   ```bash
   # Install serve globally
   npm install -g serve
   
   # Run the server
   serve -p 8000
   ```

3. **Using PHP (if installed):**
   ```bash
   php -S localhost:8000
   ```

4. Open your browser and navigate to `http://localhost:8000`

### Option 2: Direct File Access

Simply open `index.html` in your web browser. Note: PWA features (offline support, installation) require a server.

## Installation as PWA

1. Open the app in Chrome, Safari, or other PWA-supported browser
2. Look for the "Install" or "Add to Home Screen" option
3. Follow the prompts to install on your device
4. The app will work offline once installed

## Browser Support

- **Chrome/Edge**: Full PWA support including installation
- **Safari**: PWA support with "Add to Home Screen"
- **Firefox**: Basic functionality, limited PWA features
- **Mobile browsers**: Optimized for touch interfaces

## Technical Details

- **Vanilla JavaScript**: No frameworks or dependencies
- **Responsive CSS**: Works on all screen sizes
- **Service Worker**: Enables offline functionality
- **Web App Manifest**: Enables installation
- **Accessibility**: ARIA labels, keyboard navigation, high contrast

## Input Validation

- Only accepts numeric input (0-999)
- Minimum weight: 45 lbs (weight of the bar)
- Maximum weight: 999 lbs
- Handles decimal results by rounding to nearest 0.5 lb

## Files Structure

```
├── index.html          # Main HTML file
├── styles.css          # Styling and responsive design
├── script.js           # JavaScript functionality
├── manifest.json       # PWA manifest for installation
├── sw.js              # Service worker for offline support
└── README.md          # This file
```

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements. 