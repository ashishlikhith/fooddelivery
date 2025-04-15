// Get current restaurant from localStorage
const currentRestaurant = JSON.parse(localStorage.getItem('currentRestaurant'));
const restaurantName = document.getElementById('restaurant-name');
const restaurantRating = document.getElementById('restaurant-rating');
const restaurantCuisine = document.getElementById('restaurant-cuisine');
const restaurantLocation = document.getElementById('restaurant-location');
const menuCategories = document.querySelector('.menu-categories');
const menuItems = document.querySelector('.menu-items');
const cartCount = document.getElementById('cart-count');

// Sample menu data
const menuData = {
    1: {
        categories: ["Starters", "Main Course", "Breads", "Desserts"],
        items: [
            { id: 101, name: "Paneer Tikka", price: 220, category: "Starters" },
            { id: 102, name: "Butter Chicken", price: 280, category: "Main Course" },
            { id: 103, name: "Garlic Naan", price: 50, category: "Breads" },
            { id: 104, name: "Gulab Jamun", price: 90, category: "Desserts" }
        ]
    },
    2: {
        categories: ["Soups", "Noodles", "Rice", "Dim Sum"],
        items: [
            { id: 201, name: "Hot & Sour Soup", price: 120, category: "Soups" },
            { id: 202, name: "Hakka Noodles", price: 180, category: "Noodles" },
            { id: 203, name: "Fried Rice", price: 160, category: "Rice" },
            { id: 204, name: "Steamed Dim Sum", price: 150, category: "Dim Sum" }
        ]
    },
    3: {
        categories: ["Pizzas", "Pasta", "Salads", "Desserts"],
        items: [
            { id: 301, name: "Margherita Pizza", price: 250, category: "Pizzas" },
            { id: 302, name: "Alfredo Pasta", price: 220, category: "Pasta" },
            { id: 303, name: "Caesar Salad", price: 180, category: "Salads" },
            { id: 304, name: "Tiramisu", price: 150, category: "Desserts" }
        ]
    }
};

// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Display restaurant info
function displayRestaurantInfo() {
    if (!currentRestaurant) {
        window.location.href = 'index.html';
        return;
    }
    
    restaurantName.textContent = currentRestaurant.name;
    restaurantRating.textContent = `${currentRestaurant.rating} ★`;
    restaurantCuisine.textContent = currentRestaurant.cuisine.join(', ');
    restaurantLocation.textContent = currentRestaurant.location;
}

// Display menu categories
function displayMenuCategories() {
    const categories = menuData[currentRestaurant.id].categories;
    
    categories.forEach(category => {
        const categoryElement = document.createElement('h3');
        categoryElement.textContent = category;
        categoryElement.addEventListener('click', () => {
            displayMenuItems(category);
        });
        menuCategories.appendChild(categoryElement);
    });
    
    // Display first category by default
    if (categories.length > 0) {
        displayMenuItems(categories[0]);
    }
}

// Display menu items for a category
function displayMenuItems(category) {
    menuItems.innerHTML = '';
    
    const items = menuData[currentRestaurant.id].items.filter(
        item => item.category === category
    );
    
    items.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'menu-item-card';
        
        // Check if item is already in cart
        const cartItem = cart.find(ci => ci.id === item.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        itemCard.innerHTML = `
            <div class="menu-item-info">
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-price">₹${item.price}</div>
            </div>
            <div class="menu-item-controls">
                <button class="decrease-btn" data-id="${item.id}">-</button>
                <span class="menu-item-quantity">${quantity}</span>
                <button class="increase-btn" data-id="${item.id}">+</button>
            </div>
        `;
        
        menuItems.appendChild(itemCard);
    });
    
    // Add event listeners to buttons
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            addToCart(parseInt(btn.dataset.id));
        });
    });
    
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(parseInt(btn.dataset.id));
        });
    });
}

// Add item to cart
function addToCart(itemId) {
    const item = menuData[currentRestaurant.id].items.find(i => i.id === itemId);
    
    const existingItem = cart.find(i => i.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            restaurantId: currentRestaurant.id,
            restaurantName: currentRestaurant.name,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayMenuItems(document.querySelector('.menu-categories h3').textContent);
}

// Remove item from cart
function removeFromCart(itemId) {
    const existingItemIndex = cart.findIndex(i => i.id === itemId);
    
    if (existingItemIndex !== -1) {
        if (cart[existingItemIndex].quantity > 1) {
            cart[existingItemIndex].quantity -= 1;
        } else {
            cart.splice(existingItemIndex, 1);
        }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayMenuItems(document.querySelector('.menu-categories h3').textContent);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayRestaurantInfo();
    displayMenuCategories();
});