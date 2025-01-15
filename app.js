// Sample property data
const properties = [
    {
        id: 1,
        title: "Cozy Apartment in Downtown",
        description: "Beautiful apartment with modern amenities and stunning city views",
        latitude: 12.9716,
        longitude: 77.5946,
        price: "$450,000",
        bedrooms: 2,
        bathrooms: 2,
        sqft: 1200
    },
    {
        id: 2,
        title: "Suburban Family Home",
        description: "Spacious family home with a large backyard in a quiet neighborhood",
        latitude: 12.9345,
        longitude: 77.6156,
        price: "$750,000",
        bedrooms: 4,
        bathrooms: 3,
        sqft: 2500
    },
    {
        id: 3,
        title: "Modern City Loft",
        description: "Industrial-style loft with high ceilings and premium finishes",
        latitude: 12.9850,
        longitude: 77.5633,
        price: "$550,000",
        bedrooms: 1,
        bathrooms: 2,
        sqft: 1000
    }
];

// Function to create property cards
function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.innerHTML = `
        <div class="property-details">
            <h2 class="property-title">${property.title}</h2>
            <p class="property-description">${property.description}</p>
            <div class="property-info">
                <span>🛏️ ${property.bedrooms} beds</span>
                <span>🚿 ${property.bathrooms} baths</span>
                <span>📏 ${property.sqft} sqft</span>
            </div>
            <p class="coordinates">
                Latitude: ${property.latitude}<br>
                Longitude: ${property.longitude}
            </p>
            <button class="show-greenery-btn" onclick="fetchGreeneryData(${property.id}, ${property.latitude}, ${property.longitude})">
                Show Greenery Percentage Near This Location
            </button>
            <div id="greenery-results-${property.id}" class="greenery-results" style="display: none;">
                <p class="satellite-message">We extracted satellite imagery of your location and...</p>
                <div class="greenery-percentage"></div>
                <img class="greenery-image" style="display: none">
            </div>
            <div id="error-${property.id}" class="error-message"></div>
        </div>
    `;
    return card;
}

// Function to fetch greenery data from API
async function fetchGreeneryData(propertyId, latitude, longitude) {
    const button = document.querySelector(`button[onclick*="${propertyId}"]`);
    const resultsDiv = document.getElementById(`greenery-results-${propertyId}`);
    const percentageDiv = resultsDiv.querySelector('.greenery-percentage');
    const imageElement = resultsDiv.querySelector('.greenery-image');
    const errorDiv = document.getElementById(`error-${propertyId}`);

    // Disable button and show loading state
    button.disabled = true;
    button.textContent = 'Loading...';
    errorDiv.textContent = '';
    resultsDiv.style.display = 'none';
    imageElement.style.display = 'none';

    try {
        // Fetching greenery data from the API
        const response = await fetch(
            `https://sushanthh2.pythonanywhere.com/detect_greenery?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch greenery data');
        }

        const data = await response.json();

        // Check if data contains the expected fields
        if (data.greenery_percentage && data.image_url) {
            const percentage = data.greenery_percentage.toFixed(2); // Limit to 2 decimal places

            // Display the results
            percentageDiv.textContent = `Your 500m surrounding is covered by ${percentage}% of greenery`;
            imageElement.src = data.image_url;
            imageElement.alt = 'Area Greenery';

            // Show results
            resultsDiv.style.display = 'block';
            imageElement.style.display = 'block';
        } else {
            throw new Error('Invalid data received from API');
        }
    } catch (error) {
        errorDiv.textContent = 'Error fetching greenery percentage. Please try again later.';
        console.error('Error fetching greenery percentage:', error);
    } finally {
        // Enable the button and reset the text
        button.disabled = false;
        button.textContent = 'Show Greenery Percentage Near This Location';
    }
}

// Initialize the app by creating property cards
function initApp() {
    const container = document.getElementById('properties-container');
    properties.forEach(property => {
        container.appendChild(createPropertyCard(property));
    });
}

// Start the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
