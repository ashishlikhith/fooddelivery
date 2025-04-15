// Sample restaurant data
const restaurants = [
    {
        id: 1,
        name: "Spice Garden",
        image: "images/restaurant1.jpg",
        rating: 4.2,
        cuisine: ["indian", "north indian"],
        location: "Downtown",
        deliveryTime: "30-40 mins"
    },
    {
        id: 2,
        name: "Dragon Wok",
        image: "images/restaurant2.jpg",
        rating: 4.5,
        cuisine: ["chinese", "asian"],
        location: "Chinatown",
        deliveryTime: "25-35 mins"
    },
    {
        id: 3,
        name: "Pizza Heaven",
        image: "images/restaurant3.jpg",
        rating: 4.0,
        cuisine: ["italian", "pizza"],
        location: "Westside",
        deliveryTime: "20-30 mins"
    },
    {
        id: 4,
        name: "Taco Fiesta",
        image: "images/restaurant4.jpg",
        rating: 4.1,
        cuisine: ["mexican", "tex-mex"],
        location: "Southside",
        deliveryTime: "15-25 mins"
    },
    {
        id: 5,
        name: "Sushi Palace",
        image: "images/restaurant5.jpg",
        rating: 4.7,
        cuisine: ["japanese", "sushi"],
        location: "Eastside",
        deliveryTime: "20-30 mins"
    }
];

// ===== AI SEARCH FUNCTIONALITY =====
async function aiSearchByCuisine() {
    const query = searchInput.value.trim();
    if (!query) {
        alert("Please enter a search query first");
        return;
    }
    
    // Show loading state
    aiSearchBtn.disabled = true;
    aiSearchBtn.textContent = "Analyzing...";
    
    try {
        // In a real app, you would call an AI API here
        const cuisineType = await detectCuisineType(query);
        filterRestaurants(cuisineType);
        
        // Show AI result feedback
        searchInput.placeholder = `Showing ${cuisineType} restaurants...`;
    } catch (error) {
        console.error("AI search failed:", error);
        alert("AI search is currently unavailable. Please try a regular search.");
    } finally {
        // Reset button state
        aiSearchBtn.disabled = false;
        aiSearchBtn.textContent = "AI Search by Cuisine";
    }
}

// Enhanced cuisine detection with more keywords
async function detectCuisineType(query) {
    // Simulate API delay (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const cuisineKeywords = {
        indian: ['indian', 'curry', 'naan', 'biryani', 'tandoori', 'masala', 'samosa', 'butter chicken', 'dal', 'paneer'],
        chinese: ['chinese', 'noodles', 'dim sum', 'dumpling', 'wok', 'szechuan', 'fried rice', 'lo mein', 'kung pao', 'peking duck'],
        italian: ['italian', 'pasta', 'pizza', 'risotto', 'gnocchi', 'tiramisu', 'lasagna', 'ravioli', 'carbonara', 'bruschetta'],
        mexican: ['mexican', 'taco', 'burrito', 'quesadilla', 'enchilada', 'fajita', 'guacamole', 'salsa', 'nachos', 'churros'],
        japanese: ['japanese', 'sushi', 'ramen', 'tempura', 'teriyaki', 'udon', 'sashimi', 'miso', 'wasabi', 'bento']
    };
    
    // Convert query to lowercase for case-insensitive matching
    const lowerQuery = query.toLowerCase();
    
    // Find matching cuisine
    for (const [cuisine, keywords] of Object.entries(cuisineKeywords)) {
        if (keywords.some(keyword => lowerQuery.includes(keyword))) {
            return cuisine;
        }
    }
    
    // If no specific cuisine detected, try to infer from general terms
    if (lowerQuery.includes('spicy') || lowerQuery.includes('hot')) {
        return Math.random() > 0.5 ? 'indian' : 'mexican';
    }
    if (lowerQuery.includes('cheese') || lowerQuery.includes('cream')) {
        return 'italian';
    }
    if (lowerQuery.includes('rice') || lowerQuery.includes('noodle')) {
        return Math.random() > 0.5 ? 'chinese' : 'japanese';
    }
    
    // Fallback to showing all restaurants
    return 'all';
}
// ===== END AI SEARCH FUNCTIONALITY =====

// DOM Elements
const restaurantList = document.querySelector('.restaurant-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const aiSearchBtn = document.getElementById('ai-search-btn');
const filterBtns = document.querySelectorAll('.filter-btn');
const cartCount = document.getElementById('cart-count');

// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Display restaurants
function displayRestaurants(restaurantsToDisplay) {
    restaurantList.innerHTML = '';
    
    if (restaurantsToDisplay.length === 0) {
        restaurantList.innerHTML = '<p class="no-results">No restaurants found. Try a different search.</p>';
        return;
    }
    
    restaurantsToDisplay.forEach(restaurant => {
        const restaurantCard = document.createElement('div');
        restaurantCard.className = 'restaurant-card';
        restaurantCard.innerHTML = `
            <img src="${restaurant.image}" alt="${restaurant.name}" class="restaurant-image">
            <div class="restaurant-info">
                <h3 class="restaurant-name">${restaurant.name}</h3>
                <div class="restaurant-details">
                    <span class="restaurant-rating">${restaurant.rating} ★</span>
                    <span>• ${restaurant.cuisine.join(', ')}</span>
                    <span>• ${restaurant.location}</span>
                </div>
                <p>${restaurant.deliveryTime}</p>
            </div>
        `;
        
        restaurantCard.addEventListener('click', () => {
            localStorage.setItem('currentRestaurant', JSON.stringify(restaurant));
            window.location.href = 'restaurant.html';
        });
        
        restaurantList.appendChild(restaurantCard);
    });
}

// Filter restaurants by cuisine
function filterRestaurants(cuisine) {
    if (cuisine === 'all') {
        displayRestaurants(restaurants);
        return;
    }
    
    const filtered = restaurants.filter(restaurant => 
        restaurant.cuisine.includes(cuisine)
    );
    displayRestaurants(filtered);
}

// Search restaurants by name or cuisine
function searchRestaurants(query) {
    const results = restaurants.filter(restaurant => 
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.some(c => c.toLowerCase().includes(query.toLowerCase()))
    );
    displayRestaurants(results);
}

// Update cart count in header
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayRestaurants(restaurants);
});

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchRestaurants(query);
    } else {
        alert("Please enter a search term");
    }
});

// AI Search button event listener
aiSearchBtn.addEventListener('click', aiSearchByCuisine);

// Handle Enter key in search input
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchRestaurants(query);
        }
    }
});

// Filter buttons event listeners
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        filterRestaurants(btn.dataset.cuisine);
    });
});