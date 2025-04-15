const cartItems = document.querySelector('.cart-items');
const subtotal = document.getElementById('subtotal');
const tax = document.getElementById('tax');
const total = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display cart items
function displayCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
        return;
    }
    
    // Group items by restaurant
    const restaurants = {};
    cart.forEach(item => {
        if (!restaurants[item.restaurantId]) {
            restaurants[item.restaurantId] = {
                name: item.restaurantName,
                items: []
            };
        }
        restaurants[item.restaurantId].items.push(item);
    });
    
    // Display items for each restaurant
    for (const restaurantId in restaurants) {
        const restaurant = restaurants[restaurantId];
        
        const restaurantHeader = document.createElement('div');
        restaurantHeader.className = 'restaurant-header';
        restaurantHeader.innerHTML = `<h3>${restaurant.name}</h3>`;
        cartItems.appendChild(restaurantHeader);
        
        restaurant.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="decrease-btn" data-id="${item.id}">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="increase-btn" data-id="${item.id}">+</button>
                </div>
            `;
            cartItems.appendChild(itemElement);
        });
    }
    
    // Add event listeners to buttons
    document.querySelectorAll('.increase-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = parseInt(btn.dataset.id);
            const item = cart.find(i => i.id === itemId);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        });
    });
    
    document.querySelectorAll('.decrease-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemId = parseInt(btn.dataset.id);
            const itemIndex = cart.findIndex(i => i.id === itemId);
            
            if (itemIndex !== -1) {
                if (cart[itemIndex].quantity > 1) {
                    cart[itemIndex].quantity -= 1;
                } else {
                    cart.splice(itemIndex, 1);
                }
                updateCart();
            }
        });
    });
}

// Update cart totals
function updateTotals() {
    const subTotalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 30;
    const taxValue = subTotalValue * 0.05; // 5% tax
    
    subtotal.textContent = `₹${subTotalValue}`;
    tax.textContent = `₹${taxValue.toFixed(2)}`;
    total.textContent = `₹${(subTotalValue + deliveryFee + taxValue).toFixed(2)}`;
}

// Update cart in localStorage and refresh display
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateTotals();
    
    // Update cart count in all pages
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Checkout button
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // In a real app, you would redirect to payment page
    alert('Proceeding to checkout!');
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
    updateTotals();
});