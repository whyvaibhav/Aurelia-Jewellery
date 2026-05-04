const STORAGE_KEYS = {
    products: "jewellery-products",
    cart: "jewellery-cart",
    wishlist: "jewellery-wishlist",
    users: "jewellery-users",
    orders: "jewellery-orders",
    theme: "jewellery-theme",
    currentUser: "jewellery-current-user"
};

const sampleProducts = [
    { id: 1, name: "Aurora Diamond Ring", price: 450000, category: "rings", stock: 14, featured: true, image: "images/aurora_diamond_ring.jpg", description: "A brilliant solitaire diamond ring set in 18k white gold — a signature engagement piece." },
    { id: 3, name: "Golden Riviera Bracelet", price: 620000, category: "bracelets", stock: 6, featured: true, image: "images/golden_riviera_bracelet.jpg", description: "A handcrafted link bracelet in 22k yellow gold with fluid, architectural lines." },
    { id: 4, name: "Pearl Cascade Earrings", price: 145000, category: "earrings", stock: 18, featured: true, image: "images/pearl_cascade_earrings.jpg", description: "Cultured pearls arranged in a cascading drop design finished with rose gold accents." },
    { id: 5, name: "Celeste Emerald Ring", price: 390000, category: "rings", stock: 8, featured: false, image: "images/celeste_emerald_ring.jpg", description: "A vivid emerald cut gem set within a delicate gold frame — ideal for special occasions." },
    { id: 2, name: "Sapphire Halo Pendant", price: 280000, category: "necklaces", stock: 10, featured: true, image: "images/sapphire_halo_pendant.jpg", description: "Deep Ceylon sapphire framed by a delicate halo of melee diamonds on a fine chain." },
    { id: 6, name: "Luna Pearl Necklace", price: 510000, category: "necklaces", stock: 9, featured: true, image: "images/luna_pearl_necklace.jpg", description: "Signature multi-strand pearls with a handcrafted diamond clasp in 18k gold." },
    { id: 7, name: "Heritage Cuff Bracelet", price: 330000, category: "bracelets", stock: 12, featured: false, image: "images/heritage_cuff_bracelet.jpg", description: "A sculptural cuff in vermeil finish inspired by classical motifs." },
    { id: 8, name: "Diamond Star Earrings", price: 185000, category: "earrings", stock: 11, featured: false, image: "images/diamond_star_earrings.jpg", description: "Contemporary star-shaped studs set with brilliant diamonds for everyday sparkle." }
];

let activeAuthTab = "login";



document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
    seedData();
    applyTheme(getTheme());
    ensureAuthModal();
    bindGlobalActions();
    updateHeaderState();
    renderFeatured();
    renderAllProducts();
    renderProductDetails();
    renderCart();
    renderCheckout();
    renderAdmin();
    attachCommonForms();
}

function seedData() {
    const storedProducts = readStore(STORAGE_KEYS.products, null);
    const needsReset = !Array.isArray(storedProducts) || storedProducts.length === 0;
    if (needsReset) {
        localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(sampleProducts));
    } else {
        // Update images for existing sample products without overwriting user changes to stock or price
        let updated = false;
        const mappedProducts = storedProducts.map((p) => {
            const sample = sampleProducts.find((s) => s.id === p.id);
            if (sample && p.image !== sample.image) {
                updated = true;
                return { ...p, image: sample.image };
            }
            return p;
        });
        if (updated) {
            localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(mappedProducts));
        }
    }
    if (!localStorage.getItem(STORAGE_KEYS.cart)) localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify([]));
    if (!localStorage.getItem(STORAGE_KEYS.wishlist)) localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify([]));
    const existingUsers = readStore(STORAGE_KEYS.users, []);
    if (!existingUsers || !existingUsers.length) {
        const seed = [
            { name: "Site Admin", email: "admin@aurelia.in", password: "aureliaAdmin123", isAdmin: true },
            { name: "Guest Concierge", email: "demo@aurelia.com", password: "aurelia123", isAdmin: false }
        ];
        localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(seed));
    } else {
        const adminExists = existingUsers.some((u) => u.email && u.email.toLowerCase() === "admin@aurelia.in");
        if (!adminExists) {
            existingUsers.unshift({ name: "Site Admin", email: "admin@aurelia.in", password: "aureliaAdmin123", isAdmin: true });
            saveUsers(existingUsers);
        }
    }
    if (!localStorage.getItem(STORAGE_KEYS.orders)) localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify([]));

    const products = readStore(STORAGE_KEYS.products, sampleProducts);
    const cart = readStore(STORAGE_KEYS.cart, []);
    const normalizedCart = cart.map((item) => {
        const match = products.find((product) => product.id === item.id);
        return match ? { ...match, quantity: item.quantity } : item;
    });
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(normalizedCart));
}

function readStore(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function getProducts() {
    return readStore(STORAGE_KEYS.products, []);
}

function saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
}

function getCart() {
    return readStore(STORAGE_KEYS.cart, []);
}

function saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    updateHeaderState();
}

function getWishlist() {
    return readStore(STORAGE_KEYS.wishlist, []);
}

function saveWishlist(wishlist) {
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
    updateHeaderState();
}

function getUsers() {
    return readStore(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getOrders() {
    return readStore(STORAGE_KEYS.orders, []);
}

function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function getTheme() {
    return localStorage.getItem(STORAGE_KEYS.theme) || "light";
}

function applyTheme(theme) {
    document.body.classList.toggle("dark-mode", theme === "dark");
    localStorage.setItem(STORAGE_KEYS.theme, theme);
    const button = document.querySelector("[data-theme-toggle]");
    if (button) {
        button.textContent = theme === "dark" ? "☀" : "☾";
        button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
}

function toggleTheme() {
    applyTheme(getTheme() === "dark" ? "light" : "dark");
}

function formatPrice(price) {
    try {
        return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price);
    } catch (e) {
        return "₹" + Number(price).toLocaleString("en-IN");
    }
}

function getCurrentUser() {
    return readStore(STORAGE_KEYS.currentUser, null);
}

function setCurrentUser(user) {
    if (user) localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.currentUser);
    updateHeaderState();
}

function bindGlobalActions() {
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => button.addEventListener("click", toggleTheme));
    document.querySelectorAll("[data-auth-open]").forEach((button) => button.addEventListener("click", () => openAuthModal(button.dataset.authOpen || "login")));
    document.querySelectorAll("[data-scroll-to]").forEach((button) => button.addEventListener("click", () => {
        const target = document.querySelector(button.dataset.scrollTo);
        if (target) target.scrollIntoView({ behavior: "smooth" });
    }));
}

function updateHeaderState() {
    const cartCount = getCart().reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = getWishlist().length;
    const currentUser = getCurrentUser();
    const cartBadge = document.querySelector("[data-cart-count]");
    const wishlistBadge = document.querySelector("[data-wishlist-count]");
    const userBadge = document.querySelector("[data-user-badge]");
    if (cartBadge) cartBadge.textContent = cartCount;
    if (wishlistBadge) wishlistBadge.textContent = wishlistCount;
    if (userBadge) userBadge.textContent = currentUser ? currentUser.name.split(" ")[0] : "Account";
}

function createProductCard(product) {
    const wished = getWishlist().includes(product.id);
    return `
        <article class="product-card">
            <a class="product-media" href="product.html?id=${product.id}" aria-label="View ${product.name}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
            </a>
            <div class="card-body">
                <div class="meta-row">
                    <span class="pill small">${product.category}</span>
                    <span class="product-price">${formatPrice(product.price)}</span>
                </div>
                <h3 class="product-title serif">${product.name}</h3>
                <p class="muted small">${product.description}</p>
                <div class="button-row">
                    <a class="btn btn-outline" href="product.html?id=${product.id}">View Details</a>
                    <button class="btn btn-primary" type="button" onclick="addToCart(${product.id}, 1)">Add to Cart</button>
                    <button class="btn btn-outline" type="button" onclick="toggleWishlist(${product.id})">${wished ? "Wishlisted" : "Wishlist"}</button>
                </div>
            </div>
        </article>
    `;
}

function renderFeatured() {
    const grid = document.getElementById("featured-grid");
    if (!grid) return;
    const products = getProducts().filter((product) => product.featured).slice(0, 4);
    grid.innerHTML = products.map(createProductCard).join("");
}

function renderAllProducts() {
    const grid = document.getElementById("products-grid");
    if (!grid) return;
    const search = (document.getElementById("product-search")?.value || "").trim().toLowerCase();
    const category = document.getElementById("category-filter")?.value || "all";
    const maxPrice = Number(document.getElementById("price-filter")?.value || 10000);
    const sort = document.getElementById("sort-filter")?.value || "featured";
    let products = getProducts().filter((product) => {
        const matchesCategory = category === "all" || product.category === category;
        const matchesSearch = !search || product.name.toLowerCase().includes(search) || product.description.toLowerCase().includes(search);
        const matchesPrice = product.price <= maxPrice;
        return matchesCategory && matchesSearch && matchesPrice;
    });
    if (sort === "price-asc") products.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") products.sort((a, b) => b.price - a.price);
    if (sort === "name") products.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") products.sort((a, b) => Number(b.featured) - Number(a.featured));
    grid.innerHTML = products.length ? products.map(createProductCard).join("") : '<div class="empty-state">No pieces match your filters.</div>';
}

function bindProductFilters() {
    ["product-search", "category-filter", "price-filter", "sort-filter"].forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
            const eventName = element.tagName === "INPUT" ? "input" : "change";
            element.addEventListener(eventName, renderAllProducts);
        }
    });
}

function getDetailProduct() {
    const params = new URLSearchParams(window.location.search);
    const queryId = Number(params.get("id"));
    if (queryId) return getProducts().find((product) => product.id === queryId) || null;
    const hashId = Number(window.location.hash.replace("#", ""));
    if (hashId) return getProducts().find((product) => product.id === hashId) || null;
    return getProducts()[0] || null;
}

function renderProductDetails() {
    const container = document.getElementById("product-detail");
    if (!container) return;
    const product = getDetailProduct();
    if (!product) {
        container.innerHTML = '<div class="empty-state">Product not found.</div>';
        return;
    }
    container.innerHTML = `
        <div class="detail-layout">
            <div class="detail-media">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="detail-card panel">
                <span class="pill small">${product.category}</span>
                <h1 class="serif" style="font-size: clamp(2.1rem, 4vw, 3.6rem); margin: 0.85rem 0;">${product.name}</h1>
                <p class="product-price" style="font-size: 1.55rem; margin-bottom: 1rem;">${formatPrice(product.price)}</p>
                <p class="muted" style="margin-bottom: 1rem;">${product.description}</p>
                <p class="small muted" style="margin-bottom: 1.2rem;">Inventory available: ${product.stock}</p>
                <div class="quantity-row">
                    <label class="field" style="max-width: 120px;"><span>Quantity</span><input id="detail-qty" type="number" min="1" value="1"></label>
                    <button class="btn btn-primary" type="button" id="detail-add">Add to Cart</button>
                    <button class="btn btn-outline" type="button" id="detail-wishlist">Wishlist</button>
                </div>
                <div class="summary-box" style="margin-top: 1.25rem;">Hand-finished with a couture-inspired silhouette and polished luxury detailing.</div>
            </div>
        </div>
        <section class="section" style="padding-left: 0; padding-right: 0;">
            <div class="section-header">
                <div>
                    <h2 class="section-title serif">You May Also Love</h2>
                    <p class="section-copy">Pieces selected to complement the current collection.</p>
                </div>
            </div>
            <div class="grid" id="related-grid"></div>
        </section>
    `;
    document.getElementById("detail-add")?.addEventListener("click", () => addToCart(product.id, Number(document.getElementById("detail-qty")?.value || 1)));
    document.getElementById("detail-wishlist")?.addEventListener("click", () => toggleWishlist(product.id));
    const relatedGrid = document.getElementById("related-grid");
    if (relatedGrid) {
        relatedGrid.innerHTML = getProducts().filter((item) => item.category === product.category && item.id !== product.id).slice(0, 3).map(createProductCard).join("");
    }
}

function addToCart(id, quantity = 1) {
    const product = getProducts().find((item) => item.id === id);
    if (!product) return;
    const cart = getCart();
    const item = cart.find((entry) => entry.id === id);
    if (item) item.quantity += quantity;
    else cart.push({ ...product, quantity });
    saveCart(cart);
    notify("Added to cart");
}

function updateCartQuantity(id, quantity) {
    const cart = getCart();
    const item = cart.find((entry) => entry.id === id);
    if (!item) return;
    item.quantity = Math.max(1, Number(quantity) || 1);
    saveCart(cart);
    renderCart();
}

function removeFromCart(id) {
    saveCart(getCart().filter((item) => item.id !== id));
    renderCart();
}

function toggleWishlist(id) {
    const wishlist = getWishlist();
    const index = wishlist.indexOf(id);
    if (index >= 0) wishlist.splice(index, 1);
    else wishlist.push(id);
    saveWishlist(wishlist);
    renderFeatured();
    renderAllProducts();
    renderProductDetails();
    notify(index >= 0 ? "Removed from wishlist" : "Saved to wishlist");
}

function renderCart() {
    const container = document.getElementById("cart-items");
    if (!container) return;
    const cart = getCart();
    const summary = document.getElementById("cart-summary");
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (!cart.length) {
        container.innerHTML = '<div class="empty-state">Your cart is empty. Explore the collections to begin.</div>';
        if (summary) summary.innerHTML = '<div class="summary-line"><span>Total</span><strong>$0</strong></div>';
        const totalEl = document.getElementById("cart-total");
        if (totalEl) totalEl.textContent = "$0";
        return;
    }
    container.innerHTML = cart.map((item) => `
        <article class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div>
                <div class="inline-row">
                    <h3 class="serif">${item.name}</h3>
                    <span class="accent">${formatPrice(item.price)}</span>
                </div>
                <p class="muted small">${item.category} · ${item.stock} pieces available</p>
                <div class="cart-actions" style="margin-top: 0.8rem;">
                    <label class="field" style="max-width: 110px;"><span>Qty</span><input type="number" min="1" value="${item.quantity}" onchange="updateCartQuantity(${item.id}, this.value)"></label>
                    <button class="btn btn-outline" type="button" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
            <strong>${formatPrice(item.price * item.quantity)}</strong>
        </article>
    `).join("");
    if (summary) {
        summary.innerHTML = `
            <div class="summary-line"><span>Items</span><strong>${cart.reduce((sum, item) => sum + item.quantity, 0)}</strong></div>
            <div class="summary-line"><span>Subtotal</span><strong>${formatPrice(total)}</strong></div>
            <div class="summary-line"><span>Delivery</span><strong>Complimentary</strong></div>
            <div class="summary-line"><span>Total</span><strong>${formatPrice(total)}</strong></div>
        `;
    }
    const totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.textContent = formatPrice(total);
}

function checkout() {
    if (!getCart().length) {
        notify("Cart is empty");
        return;
    }
    window.location.href = "checkout.html";
}

function renderCheckout() {
    const summary = document.getElementById("checkout-summary");
    if (!summary) return;
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    summary.innerHTML = cart.length ? cart.map((item) => `
        <div class="summary-line"><span>${item.name} x ${item.quantity}</span><strong>${formatPrice(item.price * item.quantity)}</strong></div>
    `).join("") + `<div class="summary-line"><span>Total</span><strong>${formatPrice(total)}</strong></div>` : '<div class="empty-state">Your cart is empty.</div>';
}

function placeOrder(event) {
    if (event) event.preventDefault();
    const cart = getCart();
    if (!cart.length) {
        notify("Cart is empty");
        return;
    }
    const name = document.getElementById("checkout-name")?.value.trim();
    const address = document.getElementById("checkout-address")?.value.trim();
    const phone = document.getElementById("checkout-phone")?.value.trim();
    if (!name || !address || !phone) {
        notify("Please complete the checkout form");
        return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = { id: Date.now(), customer: { name, address, phone }, items: cart, total, date: new Date().toISOString() };
    saveOrders([order, ...getOrders()]);
    saveCart([]);
    renderCheckout();
    const banner = document.getElementById("checkout-success");
    if (banner) {
        banner.textContent = `Thank you, ${name}. Your order has been placed successfully.`;
        banner.hidden = false;
    }
    const form = document.getElementById("checkout-form");
    if (form) form.reset();
}

function renderAdmin() {
    const container = document.getElementById("admin-panel");
    if (!container) return;
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.isAdmin) {
        container.innerHTML = `
            <div class="panel stack">
                <h1 class="serif">Admin Access Required</h1>
                <p class="muted">You must be signed in as an administrator to manage inventory.</p>
                <div class="button-row" style="margin-top:1rem;">
                    <button class="btn btn-primary" type="button" onclick="openAuthModal('login')">Sign In</button>
                </div>
            </div>
        `;
        return;
    }
    const products = getProducts();
    container.innerHTML = `
        <div class="admin-panel stack">
            <div class="section-header" style="margin-bottom: 0;">
                <div>
                    <h1 class="section-title serif">Admin Dashboard</h1>
                    <p class="section-copy">Manage your boutique inventory directly in the browser.</p>
                </div>
                <div class="inline-row" style="align-items:center;gap:0.75rem;">
                    <span class="status">Live Inventory</span>
                    <button class="btn btn-outline" type="button" onclick="adminLogout()">Sign out</button>
                </div>
            </div>
            <form id="product-form" class="stack panel" style="padding: 1.25rem;">
                <input type="hidden" id="product-id">
                <div class="split">
                    <label class="field"><span>Name</span><input id="admin-name" type="text" placeholder="Product name"></label>
                    <label class="field"><span>Price</span><input id="admin-price" type="number" min="0" placeholder="Price"></label>
                    <label class="field"><span>Category</span>
                        <select id="admin-category">
                            <option value="rings">Rings</option>
                            <option value="necklaces">Necklaces</option>
                            <option value="bracelets">Bracelets</option>
                            <option value="earrings">Earrings</option>
                        </select>
                    </label>
                    <label class="field"><span>Stock</span><input id="admin-stock" type="number" min="0" placeholder="Inventory"></label>
                </div>
                <label class="field"><span>Image URL or Upload</span>
                    <input id="admin-image" type="url" placeholder="https://">
                    <input id="admin-image-file" type="file" accept="image/*">
                    <img id="admin-image-preview" alt="preview" style="max-width:120px; margin-top:0.5rem; display:block;">
                    <div class="muted small">Paste an image URL or upload an image (uploaded images are stored locally as data URLs).</div>
                </label>
                <label class="field"><span>Description</span><textarea id="admin-description" rows="4" placeholder="Write a short description"></textarea></label>
                <div class="button-row">
                    <button class="btn btn-primary" type="submit">Save Product</button>
                    <button class="btn btn-outline" type="button" id="admin-reset">Reset</button>
                </div>
            </form>
            <div class="stack">
                <h2 class="serif">Inventory</h2>
                <table class="table">
                    <thead>
                        <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
                    </thead>
                    <tbody id="inventory-body"></tbody>
                </table>
            </div>
        </div>
    `;
    document.getElementById("product-form")?.addEventListener("submit", handleAdminSubmit);
    document.getElementById("admin-reset")?.addEventListener("click", resetAdminForm);
    renderInventoryTable(products);
    const fileInput = document.getElementById('admin-image-file');
    const urlInput = document.getElementById('admin-image');
    const preview = document.getElementById('admin-image-preview');
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            const dataUrl = ev.target.result;
            if (urlInput) urlInput.value = dataUrl;
            if (preview) preview.src = dataUrl;
        };
        reader.readAsDataURL(file);
    });
    urlInput?.addEventListener('input', () => {
        if (preview && urlInput.value && urlInput.value.startsWith('data:')) preview.src = urlInput.value;
        else if (preview && urlInput.value && (urlInput.value.startsWith('http') || urlInput.value.startsWith('//'))) preview.src = urlInput.value;
        else if (preview) preview.removeAttribute('src');
    });
}

function adminLogout() {
    setCurrentUser(null);
    notify('Signed out');
    renderAdmin();
    updateHeaderState();
}

function renderInventoryTable(products) {
    const body = document.getElementById("inventory-body");
    if (!body) return;
    body.innerHTML = products.map((product) => `
        <tr>
            <td><strong>${product.name}</strong><div class="muted small">ID ${product.id}</div></td>
            <td>${product.category}</td>
            <td>${formatPrice(product.price)}</td>
            <td>${product.stock ?? 0}</td>
            <td><div class="admin-actions"><button class="btn btn-outline" type="button" onclick="editProduct(${product.id})">Edit</button><button class="btn btn-outline" type="button" onclick="deleteProduct(${product.id})">Delete</button></div></td>
        </tr>
    `).join("");
}

function handleAdminSubmit(event) {
    event.preventDefault();
    const id = Number(document.getElementById("product-id").value);
    const name = document.getElementById("admin-name").value.trim();
    const price = Number(document.getElementById("admin-price").value);
    const category = document.getElementById("admin-category").value;
    const stock = Number(document.getElementById("admin-stock").value);
    const image = document.getElementById("admin-image").value.trim();
    const description = document.getElementById("admin-description").value.trim();
    if (!name || !price || !category || !image || !description) {
        notify("Please fill in every field");
        return;
    }
    const products = getProducts();
    const product = { id: id || Date.now(), name, price, category, stock, image, description, featured: false };
    const existingIndex = products.findIndex((item) => item.id === id);
    if (existingIndex >= 0) products[existingIndex] = { ...products[existingIndex], ...product };
    else products.unshift(product);
    saveProducts(products);
    renderInventoryTable(products);
    renderFeatured();
    renderAllProducts();
    resetAdminForm();
    notify(id ? "Product updated" : "Product added");
}

function editProduct(id) {
    const product = getProducts().find((item) => item.id === id);
    if (!product) return;
    document.getElementById("product-id").value = product.id;
    document.getElementById("admin-name").value = product.name;
    document.getElementById("admin-price").value = product.price;
    document.getElementById("admin-category").value = product.category;
    document.getElementById("admin-stock").value = product.stock ?? 0;
    document.getElementById("admin-image").value = product.image;
    document.getElementById("admin-description").value = product.description || "";
}

function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    const products = getProducts().filter((item) => item.id !== id);
    saveProducts(products);
    renderInventoryTable(products);
    renderFeatured();
    renderAllProducts();
    notify("Product deleted");
}

function resetAdminForm() {
    document.getElementById("product-form")?.reset();
    const idField = document.getElementById("product-id");
    if (idField) idField.value = "";
    const fileInput = document.getElementById('admin-image-file');
    const preview = document.getElementById('admin-image-preview');
    const urlInput = document.getElementById('admin-image');
    if (fileInput) fileInput.value = "";
    if (preview) preview.removeAttribute('src');
    if (urlInput) urlInput.value = "";
}

function attachCommonForms() {
    const checkoutForm = document.getElementById("checkout-form");
    if (checkoutForm) checkoutForm.addEventListener("submit", placeOrder);
    bindProductFilters();
}

function ensureAuthModal() {
    if (document.getElementById("auth-modal")) return;
    const modal = document.createElement("div");
    modal.id = "auth-modal";
    modal.className = "modal-backdrop";
    modal.innerHTML = `
        <div class="auth-card stack">
            <div class="inline-row">
                <div>
                    <h2 class="serif">Account</h2>
                    <p class="muted small">Register or sign in to your Aurelia account.</p>
                </div>
                <button class="btn btn-outline" type="button" id="auth-close">Close</button>
            </div>
            <div class="tab-switcher">
                <button type="button" data-auth-tab="login" class="active">Login</button>
                <button type="button" data-auth-tab="register">Register</button>
            </div>
            <form id="login-form" class="stack">
                <label class="field"><span>Email</span><input id="login-email" type="email" required></label>
                <label class="field"><span>Password</span><input id="login-password" type="password" required></label>
                <button class="btn btn-primary" type="submit">Login</button>
            </form>
            <form id="register-form" class="stack" hidden>
                <label class="field"><span>Name</span><input id="register-name" type="text" required></label>
                <label class="field"><span>Email</span><input id="register-email" type="email" required></label>
                <label class="field"><span>Password</span><input id="register-password" type="password" required></label>
                <button class="btn btn-primary" type="submit">Create Account</button>
            </form>
            <div class="summary-box" id="auth-status">Guest mode is active.</div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) closeAuthModal();
    });
    modal.querySelectorAll("[data-auth-tab]").forEach((button) => button.addEventListener("click", () => setAuthTab(button.dataset.authTab || "login")));
    document.getElementById("auth-close")?.addEventListener("click", closeAuthModal);
    document.getElementById("login-form")?.addEventListener("submit", handleLogin);
    document.getElementById("register-form")?.addEventListener("submit", handleRegister);
}

function openAuthModal(tab = "login") {
    setAuthTab(tab);
    document.getElementById("auth-modal")?.classList.add("is-open");
}

function closeAuthModal() {
    document.getElementById("auth-modal")?.classList.remove("is-open");
}

function setAuthTab(tab) {
    activeAuthTab = tab;
    document.querySelectorAll("[data-auth-tab]").forEach((button) => button.classList.toggle("active", button.dataset.authTab === tab));
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    if (loginForm) loginForm.hidden = tab !== "login";
    if (registerForm) registerForm.hidden = tab !== "register";
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value.trim().toLowerCase();
    const password = document.getElementById("login-password").value;
    const user = getUsers().find((entry) => entry.email.toLowerCase() === email && entry.password === password);
    if (!user) {
        notify("Invalid login details");
        return;
    }
    setCurrentUser({ name: user.name, email: user.email, isAdmin: !!user.isAdmin });
    document.getElementById("auth-status").textContent = `Signed in as ${user.name}.`;
    closeAuthModal();
    renderAdmin();
    updateHeaderState();
    notify(`Welcome, ${user.name}`);
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById("register-name").value.trim();
    const email = document.getElementById("register-email").value.trim().toLowerCase();
    const password = document.getElementById("register-password").value;
    if (!name || !email || !password) {
        notify("Please complete registration");
        return;
    }
    const users = getUsers();
    if (users.some((entry) => entry.email.toLowerCase() === email)) {
        notify("An account with that email already exists");
        return;
    }
    users.push({ name, email, password, isAdmin: false });
    saveUsers(users);
    setCurrentUser({ name, email, isAdmin: false });
    document.getElementById("auth-status").textContent = `Registered and signed in as ${name}.`;
    closeAuthModal();
    notify(`Welcome to Aurelia, ${name}`);
}

function notify(message) {
    const banner = document.getElementById("app-notice") || createNoticeBanner();
    banner.textContent = message;
    banner.hidden = false;
    window.clearTimeout(window.__noticeTimer);
    window.__noticeTimer = window.setTimeout(() => {
        banner.hidden = true;
    }, 2400);
}

function createNoticeBanner() {
    const banner = document.createElement("div");
    banner.id = "app-notice";
    banner.className = "notice";
    banner.hidden = true;
    banner.style.position = "fixed";
    banner.style.right = "1rem";
    banner.style.bottom = "1rem";
    banner.style.zIndex = "3000";
    banner.style.maxWidth = "22rem";
    document.body.appendChild(banner);
    return banner;
}
