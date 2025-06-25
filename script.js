// Meathead Calculator JavaScript
class MeatheadCalculator {
    constructor() {
        this.weightInput = document.getElementById('weight-input');
        this.resultOutput = document.getElementById('result-output');
        this.errorMessage = document.getElementById('error-message');
        this.plateBreakdown = document.getElementById('plate-breakdown');
        this.percentageBreakdown = document.getElementById('percentage-breakdown');
        this.barWeight = 45; // Standard Olympic barbell weight
        
        // Plate inventory inputs
        this.plateInputs = {
            '45': document.getElementById('plate-45'),
            '25': document.getElementById('plate-25'),
            '15': document.getElementById('plate-15'),
            '10': document.getElementById('plate-10'),
            '5': document.getElementById('plate-5'),
            '2.5': document.getElementById('plate-2-5')
        };
        
        // Standard plate weights in descending order
        this.plateWeights = [45, 25, 15, 10, 5, 2.5];
        
        // Percentage breakdown values (95% to 50% in 5% increments)
        this.percentageValues = [95, 90, 85, 80, 75, 70, 65, 60, 55, 50];
        
        this.loadPlateInventory();
        this.init();
    }
    
    init() {
        // Set initial state
        this.updateDisplay();
        
        // Event listeners for weight input
        this.weightInput.addEventListener('input', this.handleInput.bind(this));
        this.weightInput.addEventListener('keypress', this.handleKeyPress.bind(this));
        this.weightInput.addEventListener('paste', this.handlePaste.bind(this));
        
        // Event listeners for plate inputs
        Object.values(this.plateInputs).forEach(input => {
            input.addEventListener('input', this.handlePlateInput.bind(this));
            input.addEventListener('keypress', this.handlePlateKeyPress.bind(this));
        });
        
        // Focus the weight input on page load
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
    
    handlePlateInput(event) {
        const value = event.target.value;
        
        // Remove any non-numeric characters
        const cleanedValue = value.replace(/[^0-9]/g, '');
        
        // Update input if cleaning was necessary
        if (cleanedValue !== value) {
            event.target.value = cleanedValue;
        }
        
        // Enforce max length (2 digits for 99)
        if (cleanedValue.length > 2) {
            event.target.value = cleanedValue.slice(0, 2);
        }
        
        this.savePlateInventory();
        this.updateDisplay();
    }
    
    handlePlateKeyPress(event) {
        // Only allow numeric input
        const char = String.fromCharCode(event.which);
        if (!/[0-9]/.test(char)) {
            event.preventDefault();
        }
    }
    
    getPlateInventory() {
        const inventory = {};
        Object.entries(this.plateInputs).forEach(([weight, input]) => {
            const count = parseInt(input.value, 10) || 0;
            inventory[parseFloat(weight)] = count;
        });
        return inventory;
    }
    
    calculatePlateCombination(targetWeight, totalAvailablePlates) {
        const combination = [];
        let remainingWeight = targetWeight;
        
        // Try to make the exact weight using available plates
        for (const plateWeight of this.plateWeights) {
            const totalCount = totalAvailablePlates[plateWeight] || 0;
            const availableCountPerSide = Math.floor(totalCount / 2);
            
            const platesToUse = Math.min(availableCountPerSide, Math.floor(remainingWeight / plateWeight));
            
            if (platesToUse > 0) {
                combination.push({ weight: plateWeight, count: platesToUse });
                remainingWeight -= platesToUse * plateWeight;
            }
        }
        
        return {
            combination,
            remainingWeight,
            isExact: remainingWeight < 0.001 // Use epsilon for float comparison
        };
    }
    
    formatPlateBreakdown(combination) {
        if (combination.length === 0) {
            return 'No plates needed';
        }
        
        const parts = combination.map(plate => {
            if (plate.count === 1) {
                return `1 × ${plate.weight} lb`;
            } else {
                return `${plate.count} × ${plate.weight} lb`;
            }
        });
        
        return parts.join(', ');
    }
    
    updateDisplay() {
        const inputValue = this.weightInput.value.trim();
        
        // Clear previous errors
        this.clearError();
        
        // Handle empty input
        if (!inputValue) {
            this.showEmptyState();
            this.showEmptyPlateBreakdown();
            this.showEmptyPercentageBreakdown();
            return;
        }
        
        const totalWeight = parseInt(inputValue, 10);
        
        // Validate input
        if (isNaN(totalWeight) || totalWeight < 0) {
            this.showError('Please enter a valid weight.');
            this.showEmptyPlateBreakdown();
            this.showEmptyPercentageBreakdown();
            return;
        }
        
        if (totalWeight > 999) {
            this.showError('Weight cannot exceed 999 lbs.');
            this.showEmptyPlateBreakdown();
            this.showEmptyPercentageBreakdown();
            return;
        }
        
        if (totalWeight < this.barWeight) {
            this.showError(`Weight must be at least ${this.barWeight} lbs (the weight of the bar).`);
            this.showEmptyPlateBreakdown();
            this.showEmptyPercentageBreakdown();
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
        
        // Calculate and show plate breakdown
        this.updatePlateBreakdown(sideWeight);
        
        // Calculate and show percentage breakdown
        this.updatePercentageBreakdown(totalWeight);
    }
    
    updatePlateBreakdown(targetWeight) {
        const availablePlates = this.getPlateInventory();
        const result = this.calculatePlateCombination(targetWeight, availablePlates);
        
        if (result.isExact) {
            const breakdown = this.formatPlateBreakdown(result.combination);
            this.showPlateBreakdown(`Suggested plates per side: ${breakdown}`);
        } else {
            // Try with rounded weight
            const roundedWeight = Math.round(targetWeight * 2) / 2;
            const roundedResult = this.calculatePlateCombination(roundedWeight, availablePlates);
            
            if (roundedResult.isExact) {
                const breakdown = this.formatPlateBreakdown(roundedResult.combination);
                this.showPlateBreakdown(`Suggested plates per side: ${breakdown} (rounded to ${roundedWeight} lbs)`);
            } else {
                this.showPlateBreakdownError(`Unable to make ${targetWeight.toFixed(1)} lbs with your available plates.`);
            }
        }
    }
    
    updatePercentageBreakdown(totalWeight) {
        const percentages = this.calculatePercentages(totalWeight);
        this.showPercentageBreakdown(percentages);
    }
    
    calculatePercentages(totalWeight) {
        const percentages = [];
        
        for (const percentage of this.percentageValues) {
            const value = (totalWeight * percentage) / 100;
            const roundedValue = Math.round(value * 100) / 100; // Round to 2 decimal places
            
            percentages.push({
                percentage: percentage,
                value: roundedValue,
                label: `${percentage}% of ${totalWeight}`,
                displayValue: roundedValue.toFixed(2)
            });
        }
        
        return percentages;
    }
    
    showPercentageBreakdown(percentages) {
        const content = document.createElement('div');
        content.className = 'percentage-breakdown-content';
        
        percentages.forEach(item => {
            // Use button for accessibility
            const percentageItem = document.createElement('button');
            percentageItem.className = 'percentage-item';
            percentageItem.type = 'button';
            percentageItem.setAttribute('tabindex', '0');
            percentageItem.setAttribute('aria-label', `${item.label} is ${item.displayValue} lbs. Click to use this value.`);
            percentageItem.title = `Click to use ${item.displayValue} lbs as your input`;
            
            // Set up click handler
            percentageItem.addEventListener('click', () => {
                this.weightInput.value = item.displayValue;
                this.updateDisplay();
                this.weightInput.focus();
            });
            
            // Keyboard accessibility (Enter/Space)
            percentageItem.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    percentageItem.click();
                }
            });
            
            const label = document.createElement('span');
            label.className = 'percentage-label';
            label.textContent = item.label;
            
            const value = document.createElement('span');
            value.className = 'percentage-value';
            value.textContent = `= ${item.displayValue} lbs`;
            
            percentageItem.appendChild(label);
            percentageItem.appendChild(value);
            content.appendChild(percentageItem);
        });
        
        // Clear existing content
        this.percentageBreakdown.innerHTML = '';
        this.percentageBreakdown.appendChild(content);
        
        // Update classes and accessibility
        this.percentageBreakdown.classList.remove('empty');
        this.percentageBreakdown.setAttribute('aria-label', `Percentage breakdown for ${percentages[0]?.value ? Math.round(percentages[0].value) : 0} lbs total weight`);
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
    
    showPlateBreakdown(message) {
        this.plateBreakdown.textContent = message;
        this.plateBreakdown.classList.remove('empty', 'error');
        this.plateBreakdown.setAttribute('aria-label', `Plate breakdown: ${message}`);
    }
    
    showPlateBreakdownError(message) {
        this.plateBreakdown.textContent = message;
        this.plateBreakdown.classList.remove('empty');
        this.plateBreakdown.classList.add('error');
        this.plateBreakdown.setAttribute('aria-label', `Plate breakdown error: ${message}`);
    }
    
    showEmptyPlateBreakdown() {
        this.plateBreakdown.textContent = 'Enter a weight to see plate suggestions';
        this.plateBreakdown.classList.add('empty');
        this.plateBreakdown.classList.remove('error');
        this.plateBreakdown.setAttribute('aria-label', 'No plate breakdown yet. Enter a weight to see suggestions.');
    }
    
    showEmptyPercentageBreakdown() {
        this.percentageBreakdown.textContent = 'Enter a weight to see percentage breakdowns';
        this.percentageBreakdown.classList.add('empty');
        this.percentageBreakdown.setAttribute('aria-label', 'No percentage breakdown yet. Enter a weight to see breakdowns.');
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

    // Save plate inventory to localStorage
    savePlateInventory() {
        const inventory = {};
        Object.entries(this.plateInputs).forEach(([weight, input]) => {
            inventory[weight] = input.value;
        });
        localStorage.setItem('meathead_plate_inventory', JSON.stringify(inventory));
    }

    // Load plate inventory from localStorage
    loadPlateInventory() {
        const saved = localStorage.getItem('meathead_plate_inventory');
        if (saved) {
            try {
                const inventory = JSON.parse(saved);
                Object.entries(this.plateInputs).forEach(([weight, input]) => {
                    if (inventory[weight] !== undefined) {
                        input.value = inventory[weight];
                    }
                });
            } catch (e) {
                // Ignore parse errors
            }
        }
    }
}

// Initialize calculator (DOM is guaranteed ready by dynamic loader)
new MeatheadCalculator();

// Register service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        console.log('Registering service worker...');
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('SW registered successfully: ', registration);
                console.log('SW scope: ', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    console.log('Service Worker update found');
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available, show update notification
                            showUpdateNotification();
                        }
                    });
                });
            })
            .catch(registrationError => {
                console.error('SW registration failed: ', registrationError);
            });
    });
} else {
    console.log('Service Worker not supported');
}

// Function to show update notification
function showUpdateNotification() {
    // Create update notification
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <span>New version available!</span>
            <button onclick="location.reload()" class="update-btn">Refresh</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        font-size: 14px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .update-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .update-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        .update-btn:hover {
            background: rgba(255,255,255,0.3);
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 10000);
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