// Sample data
    let orders = [
      {id: 1, product: "Programming Book", seller: "Ahmed (CSE)", price: 300, date: "2025-06-05", status: "delivered"},
      {id: 2, product: "Scientific Calculator", seller: "Fatima (EEE)", price: 1200, date: "2025-06-07", status: "shipped"},
      {id: 3, product: "Study Lamp", seller: "Rakib (ME)", price: 200, date: "2025-06-08", status: "pending"},
      {id: 4, product: "Textbook Set", seller: "Sadia (CE)", price: 1000, date: "2025-06-03", status: "delivered"},
      {id: 5, product: "Bluetooth Speaker", seller: "Karim (EEE)", price: 1100, date: "2025-06-01", status: "cancelled"}
    ];

    let wishlistItems = [
      {id: 1, name: "Gaming Laptop", seller: "Rafi (CSE)", price: 45000, image: "https://via.placeholder.com/300x200/3cb371/ffffff?text=Gaming+Laptop", condition: "Good"},
      {id: 2, name: "Study Desk", seller: "Nadia (ME)", price: 1500, image: "https://via.placeholder.com/300x200/1e90ff/ffffff?text=Study+Desk", condition: "Like New"},
      {id: 3, name: "Smartphone", seller: "Tareq (EEE)", price: 1300, image: "https://via.placeholder.com/300x200/90ee90/000000?text=Smartphone", condition: "Good"},
      {id: 4, name: "Bicycle", seller: "Sakib (CE)", price: 4000, image: "https://via.placeholder.com/300x200/ff6b6b/ffffff?text=Bicycle", condition: "Fair"},
      {id: 5, name: "Guitar", seller: "Rahim (CSE)", price: 5000, image: "https://via.placeholder.com/300x200/4ecdc4/ffffff?text=Guitar", condition: "Excellent"}
    ];

    let cartItems = [
      {id: 1, name: "Programming Book", seller: "Ahmed (CSE)", price: 300, image: "https://via.placeholder.com/300x200/6c5ce7/ffffff?text=Book", quantity: 1},
      {id: 2, name: "Calculator", seller: "Fatima (EEE)", price: 1200, image: "https://via.placeholder.com/300x200/a29bfe/ffffff?text=Calculator", quantity: 1},
      {id: 3, name: "Study Materials", seller: "Rakib (ME)", price: 1400, image: "https://via.placeholder.com/300x200/fd79a8/ffffff?text=Materials", quantity: 1}
    ];

    function logout() {
      window.location.href = "login.html";
    }

    // Sidebar functionality
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      const mainContent = document.getElementById('mainContent');
      
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
      
      if (window.innerWidth > 768) {
        mainContent.classList.toggle('sidebar-open');
      }
    }

    function closeSidebar() {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      const mainContent = document.getElementById('mainContent');
      
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
      mainContent.classList.remove('sidebar-open');
    }

    // Navigation functionality
    function navigateTo(section) {
      document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
      });
      
      document.querySelectorAll('.sidebar a').forEach(a => {
        a.classList.remove('active');
      });
      
      document.getElementById(section + '-section').classList.add('active');
      document.getElementById('nav-' + section).classList.add('active');
      
      if (section === 'orders') {
        loadOrders();
      } else if (section === 'wishlist') {
        loadWishlist();
      } else if (section === 'cart') {
        loadCart();
      }
      
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    }

    // Load orders
    function loadOrders() {
      const tbody = document.getElementById('allOrders');
      tbody.innerHTML = '';
      
      orders.forEach(order => {
        const row = `
          <tr>
            <td>#${order.id}</td>
            <td>${order.product}</td>
            <td>${order.seller}</td>
            <td>৳${order.price}</td>
            <td>${order.date}</td>
            <td><span class="status-badge status-${order.status}">${order.status}</span></td>
            <td>
              <button class="btn-primary" onclick="trackOrder(${order.id})">Track</button>
              ${order.status === 'pending' ? `<button class="btn-remove" onclick="cancelOrder(${order.id})">Cancel</button>` : ''}
            </td>
          </tr>
        `;
        tbody.innerHTML += row;
      });
    }

    // Load wishlist
    function loadWishlist() {
      const grid = document.getElementById('wishlistGrid');
      grid.innerHTML = '';
      
      wishlistItems.forEach(item => {
        const card = `
          <div class="product-card">
            <img src="${item.image}" alt="${item.name}" class="product-image">
            <div class="product-info">
              <h3>${item.name}</h3>
              <p><strong>Seller:</strong> ${item.seller}</p>
              <p><strong>Condition:</strong> ${item.condition}</p>
              <div class="product-price">৳${item.price}</div>
              <div style="margin-top: 10px;">
                <button class="btn-primary" onclick="addToCart(${item.id})">Add to Cart</button>
                <button class="btn-remove" onclick="removeFromWishlist(${item.id})">Remove</button>
              </div>
            </div>
          </div>
        `;
        grid.innerHTML += card;
      });
    }

    // Load cart
    function loadCart() {
      const grid = document.getElementById('cartGrid');
      grid.innerHTML = '';
      
      cartItems.forEach(item => {
        const card = `
          <div class="product-card">
            <img src="${item.image}" alt="${item.name}" class="product-image">
            <div class="product-info">
              <h3>${item.name}</h3>
              <p><strong>Seller:</strong> ${item.seller}</p>
              <p><strong>Quantity:</strong> ${item.quantity}</p>
              <div class="product-price">৳${item.price}</div>
              <div style="margin-top: 10px;">
                <button class="btn-primary" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span style="margin: 0 10px;">${item.quantity}</span>
                <button class="btn-primary" onclick="updateQuantity(${item.id}, 1)">+</button>
                <button class="btn-remove" onclick="removeFromCart(${item.id})" style="margin-left: 10px;">Remove</button>
              </div>
            </div>
          </div>
        `;
        grid.innerHTML += card;
      });
      
      updateCartSummary();
    }

    // Helper functions
    function filterOrders() {
      const filter = document.getElementById('orderFilter').value;
      // Implementation for filtering orders
    }

    function searchWishlist(query) {
      // Implementation for searching wishlist
    }

    function trackOrder(orderId) {
      alert(`Tracking order #${orderId}`);
    }

    function cancelOrder(orderId) {
      if (confirm('Are you sure you want to cancel this order?')) {
        const orderIndex = orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
          orders[orderIndex].status = 'cancelled';
          loadOrders();
        }
      }
    }

    function addToCart(itemId) {
      const wishlistItem = wishlistItems.find(item => item.id === itemId);
      if (wishlistItem) {
        cartItems.push({
          id: Date.now(),
          name: wishlistItem.name,
          seller: wishlistItem.seller,
          price: wishlistItem.price,
          image: wishlistItem.image,
          quantity: 1
        });
        updateDashboardCounts();
        alert('Item added to cart!');
      }
    }

    function removeFromWishlist(itemId) {
      wishlistItems = wishlistItems.filter(item => item.id !== itemId);
      loadWishlist();
      updateDashboardCounts();
    }

    function removeFromCart(itemId) {
      cartItems = cartItems.filter(item => item.id !== itemId);
      loadCart();
      updateDashboardCounts();
    }

    function updateQuantity(itemId, change) {
      const item = cartItems.find(item => item.id === itemId);
      if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
          removeFromCart(itemId);
        } else {
          loadCart();
        }
      }
    }

    function updateCartSummary() {
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      document.getElementById('cartTotalItems').textContent = totalItems;
      document.getElementById('cartTotal').textContent = totalAmount;
    }

    function proceedToCheckout() {
      alert('Proceeding to checkout...');
    }

    function updateDashboardCounts() {
      document.getElementById('totalOrders').textContent = orders.length;
      document.getElementById('wishlistCount').textContent = wishlistItems.length;
      document.getElementById('cartCount').textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Window resize handler
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        if (sidebar.classList.contains('show')) {
          mainContent.classList.add('sidebar-open');
        }
      } else {
        document.getElementById('mainContent').classList.remove('sidebar-open');
      }
    });

    // Initialize page
    document.addEventListener('DOMContentLoaded', function() {
      loadOrders();
      loadWishlist();
      loadCart();
      updateDashboardCounts();
    });