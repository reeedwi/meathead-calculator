// Meathead Calculator JavaScript
class MeatheadCalculator {
    constructor() {
        this.weightInput = document.getElementById('weight-input');
        this.resultOutput = document.getElementById('result-output');
        this.errorMessage = document.getElementById('error-message');
        this.barWeight = 45; // Standard Olympic barbell weight
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateDisplay();
        
        // Event listeners
        this.weightInput.addEventListener('input', this.handleInput.bind(this));
        this.weightInput.addEventListener('keypress', this.handleKeyPress.bind(this));
        this.weightInput.addEventListener('paste', this.handlePaste.bind(this));
        
        // Focus the input on page load
        setTimeout(() => {
            this.weightInput.focus();
        }, 100);
    }
    
    handleInput(event) {
        const value = event.target.value;
        
        // Remove any non-numeric characters
        const cleanedValue = value.replace(/[^0-9]/g, '');
        
        // Update input if cleaning was necessary
        if (cleanedValue !== value) {
            event.target.value = cleanedValue;
        }
        
        // Enforce max length (3 digits for 999)
        if (cleanedValue.length > 3) {
            event.target.value = cleanedValue.slice(0, 3);
        }
        
        this.updateDisplay();
    }
    
    handleKeyPress(event) {
        // Only allow numeric input
        const char = String.fromCharCode(event.which);
        if (!/[0-9]/.test(char)) {
            event.preventDefault();
        }
    }
    
    handlePaste(event) {
        // Clean pasted content
        setTimeout(() => {
            const value = event.target.value;
            const cleanedValue = value.replace(/[^0-9]/g, '').slice(0, 3);
            event.target.value = cleanedValue;
            this.updateDisplay();
        }, 0);
    }
    
    updateDisplay() {
        const inputValue = this.weightInput.value.trim();
        
        // Clear previous errors
        this.clearError();
        
        // Handle empty input
        if (!inputValue) {
            this.showEmptyState();
            return;
        }
        
        const totalWeight = parseInt(inputValue, 10);
        
        // Validate input
        if (isNaN(totalWeight) || totalWeight < 0) {
            this.showError('Please enter a valid weight.');
            return;
        }
        
        if (totalWeight > 999) {
            this.showError('Weight cannot exceed 999 lbs.');
            return;
        }
        
        if (totalWeight < this.barWeight) {
            this.showError(`Weight must be at least ${this.barWeight} lbs (the weight of the bar).`);
            return;
        }
        
        // Calculate weight per side
        const sideWeight = (totalWeight - this.barWeight) / 2;
        
        // Handle exact multiples and decimals
        if (sideWeight % 1 === 0) {
            // Whole number
            this.showResult(`Put ${sideWeight} lbs on each side of the bar.`);
        } else {
            // Decimal - round to nearest 0.5 lb and show warning
            const roundedWeight = Math.round(sideWeight * 2) / 2;
            this.showResult(`Put ${roundedWeight} lbs on each side of the bar.`);
            
            if (roundedWeight !== sideWeight) {
                this.showWarning(`Note: Rounded from ${sideWeight.toFixed(1)} lbs per side.`);
            }
        }
    }
    
    showResult(message) {
        this.resultOutput.textContent = message;
        this.resultOutput.classList.remove('empty');
        this.resultOutput.setAttribute('aria-label', `Result: ${message}`);
    }
    
    showEmptyState() {
        this.resultOutput.textContent = 'Enter a weight to see the calculation';
        this.resultOutput.classList.add('empty');
        this.resultOutput.setAttribute('aria-label', 'No calculation yet. Enter a weight to see the result.');
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.showEmptyState();
        
        // Announce error to screen readers
        this.errorMessage.setAttribute('aria-label', `Error: ${message}`);
    }
    
    showWarning(message) {
        // For rounding warnings, show in a less prominent way
        const warningElement = document.createElement('div');
        warningElement.className = 'warning-message';
        warningElement.textContent = message;
        warningElement.style.fontSize = 'clamp(0.9rem, 2.5vw, 1rem)';
        warningElement.style.opacity = '0.7';
        warningElement.style.marginTop = '0.5rem';
        
        // Remove any existing warnings
        const existingWarning = document.querySelector('.warning-message');
        if (existingWarning) {
            existingWarning.remove();
        }
        
        // Add warning below result
        this.resultOutput.parentNode.appendChild(warningElement);
        
        // Remove warning after 5 seconds
        setTimeout(() => {
            if (warningElement.parentNode) {
                warningElement.remove();
            }
        }, 5000);
    }
    
    clearError() {
        this.errorMessage.textContent = '';
        this.errorMessage.removeAttribute('aria-label');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MeatheadCalculator();
});

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('Registering service worker...');
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered successfully: ', registration);
                console.log('SW scope: ', registration.scope);
            })
            .catch(registrationError => {
                console.error('SW registration failed: ', registrationError);
            });
    });
} else {
    console.log('Service Worker not supported');
}

// Handle installation prompt for PWA
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Optionally show a custom install button or banner
    console.log('App can be installed');
});

// Handle successful installation
window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed successfully');
}); 