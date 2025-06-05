function logout() {
      window.location.href = "login.html";
    }
    
    // Load existing products from localStorage or use default
    let products = JSON.parse(localStorage.getItem('sellerProducts')) || [
      {
        id: 1,
        name: "Gaming Laptop",
        category: "Electronics",
        price: 45000,
        condition: "good",
        description: "High-performance gaming laptop with GTX graphics card",
        image: "https://via.placeholder.com/300x200/3cb371/ffffff?text=Gaming+Laptop",
        status: "active",
        featured: true,
        dateAdded: "2025-05-15",
        seller: "Current Seller",
        sellerId: "2019331001"
      },
      {
        id: 2,
        name: "Study Desk",
        category: "Furniture", 
        price: 3500,
        condition: "like-new",
        description: "Wooden study desk with drawers",
        image: "https://via.placeholder.com/300x200/1e90ff/ffffff?text=Study+Desk",
        status: "active",
        featured: true,
        dateAdded: "2025-05-20",
        seller: "Current Seller",
        sellerId: "2019331001"
      },
      {
        id: 3,
        name: "Smartphone",
        category: "Electronics",
        price: 25000,
        condition: "good",
        description: "Android smartphone with good camera",
        image: "https://via.placeholder.com/300x200/90ee90/000000?text=Smartphone",
        status: "active",
        featured: false,
        dateAdded: "2025-06-01",
        seller: "Current Seller",
        sellerId: "2019331001"
      }
    ];

    // Function to save products to localStorage
    function saveProductsToStorage() {
      localStorage.setItem('sellerProducts', JSON.stringify(products));
      
      // Also update featured products for the featured page
      const featuredProducts = products.filter(p => p.featured).map(p => ({
        ...p,
        views: p.views || 0
      }));
      localStorage.setItem('featuredProducts', JSON.stringify(featuredProducts));
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
      // Hide all sections
      document.querySelectorAll('.content-section').forEach(s => {
        s.classList.remove('active');
      });
      
      // Remove active class from all nav items
      document.querySelectorAll('.sidebar a').forEach(a => {
        a.classList.remove('active');
      });
      
      // Show selected section
      document.getElementById(section + '-section').classList.add('active');
      document.getElementById('nav-' + section).classList.add('active');
      
      // Load section-specific content
      if (section === 'products') {
        loadMyProducts();
      }
      
      // Close sidebar on mobile
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    }

    // Image preview functionality
    function previewImage(event) {
      const file = event.target.files[0];
      const preview = document.getElementById('imagePreview');
      
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          preview.src = e.target.result;
          preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    }

    // Form submission
    document.getElementById('productForm').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const productData = {
        id: Date.now(),
        name: formData.get('productName'),
        category: formData.get('category'),
        price: parseInt(formData.get('price')),
        condition: formData.get('condition'),
        description: formData.get('description'),
        image: document.getElementById('imagePreview').src || "https://via.placeholder.com/300x200/cccccc/666666?text=No+Image",
        status: 'active',
        featured: true, // Automatically set as featured for new products
        dateAdded: new Date().toISOString().split('T')[0],
        seller: "Current Seller", // You can modify this to get actual seller name
        sellerId: "2019331001", // You can modify this to get actual seller ID
        views: 0
      };
      
      products.push(productData);
      saveProductsToStorage(); // Save to localStorage
      
      // Reset form
      this.reset();
      document.getElementById('imagePreview').style.display = 'none';
      
      // Show success message
      alert('Product uploaded successfully and automatically added to featured products!');
      
      // Update dashboard counts
      updateDashboardCounts();
    });

    // Load my products
    function loadMyProducts() {
      const grid = document.getElementById('myProductsGrid');
      grid.innerHTML = '';
      
      products.forEach(product => {
        const productCard = `
          <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
              <h3>${product.name}</h3>
              <p><strong>Category:</strong> ${product.category}</p>
              <p><strong>Condition:</strong> ${product.condition}</p>
              <p><strong>Added:</strong> ${product.dateAdded}</p>
              <div class="product-price">৳${product.price}</div>
              <div style="margin: 10px 0;">
                <span class="status-badge status-${product.status}">${product.status}</span>
                ${product.featured ? '<span class="status-badge status-featured">Featured</span>' : ''}
              </div>
              <p>${product.description}</p>
              <div class="product-actions">
                <button class="btn-remove" onclick="deleteProduct(${product.id})">Delete</button>
              </div>
            </div>
          </div>
        `;
        grid.innerHTML += productCard;
      });
    }

    // Delete product
    function deleteProduct(productId) {
      if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        saveProductsToStorage(); // Update localStorage
        loadMyProducts();
        updateDashboardCounts();
      }
    }

    // Update dashboard counts
    function updateDashboardCounts() {
      document.getElementById('totalProducts').textContent = products.length + ' items';
      document.getElementById('featuredCount').textContent = products.filter(p => p.featured).length + ' items';
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
      loadMyProducts();
      updateDashboardCounts();
      saveProductsToStorage(); // Initialize localStorage on page load
    });