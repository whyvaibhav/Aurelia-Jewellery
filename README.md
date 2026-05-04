# AURELIA Luxury Jewellery E-Commerce

A premium luxury jewellery e-commerce frontend built with HTML, CSS, and vanilla JavaScript. Features a sophisticated design with dark mode support, shopping cart, admin dashboard, and order management.

## Features

### Customer Experience
- **Home Page**: Hero section with featured collections and curated pieces
- **Product Collections**: Browse all jewellery with advanced filtering (category, price, sort)
- **Product Details**: Individual product pages with detailed descriptions
- **Shopping Cart**: Add, remove, and manage quantities with persistent storage
- **Checkout**: Simple order placement with delivery information
- **Wishlist**: Save favorite items for later
- **Dark Mode**: Theme toggle for comfortable viewing

### Admin Features
- **Admin Dashboard**: Secure login-protected inventory management
- **Product Management**: Add, edit, and delete products
- **Stock Management**: Track inventory levels
- **Order History**: View all customer orders and delivery details

### Design
- **Luxury Aesthetic**: Premium color palette with gold accents and elegant typography
- **Responsive Layout**: Mobile-first design that works on all devices
- **Smooth Animations**: Polished transitions and hover effects
- **Accessible**: Semantic HTML and ARIA labels for screen readers

## Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript ES6+**: Vanilla JS without frameworks
- **LocalStorage**: Data persistence for products, cart, and orders
- **No Dependencies**: Completely self-contained

## File Structure

```
/
├── index.html          # Home page
├── products.html       # Product listing with filters
├── product.html        # Individual product details
├── cart.html          # Shopping cart
├── checkout.html      # Order checkout
├── admin.html         # Admin dashboard
├── style.css          # All styling
├── script.js          # All functionality
├── manifest.json      # Web app manifest
├── favicon.ico        # Brand favicon
└── images/            # Product images
    ├── aurora_diamond_ring.jpg
    ├── golden_riviera_bracelet.jpg
    ├── pearl_cascade_earrings.jpg
    ├── celeste_emerald_ring.jpg
    ├── sapphire_halo_pendant.jpg
    ├── luna_pearl_necklace.jpg
    ├── heritage_cuff_bracelet.jpg
    ├── diamond_star_earrings.jpg
    └── logo.png
```

## How to Use

### As a Customer
1. **Browse**: Navigate to Collections to see all products
2. **Filter**: Use search, category, price, and sort filters
3. **View Details**: Click any product to see full details and specifications
4. **Shop**: Add items to cart with desired quantities
5. **Cart**: Adjust quantities or remove items as needed
6. **Checkout**: Proceed to checkout and enter delivery information
7. **Wishlist**: Click the heart icon to save items

### As an Admin
1. Navigate to Admin panel from the navigation menu
2. Login with credentials:
   - **Email**: `admin@aurelia.in`
   - **Password**: `aureliaAdmin123`
3. Manage products: Add, edit stock/price, or delete items
4. View all orders and customer information
5. Click Logout to exit admin mode

## Demo Credentials

### Admin Account
- **Email**: `admin@aurelia.in`
- **Password**: `aureliaAdmin123`

### Demo Customer Account
- **Email**: `demo@aurelia.com`
- **Password**: `aurelia123`

## Color Palette

- **Primary Dark**: `#0B0B0B`
- **Gold Accent**: `#D4AF37`
- **White**: `#FFFFFF`
- **Beige Background**: `#f4efe7`
- **Text Primary**: `#171411`
- **Text Muted**: `#6c6459`

## Typography

- **Headings**: Playfair Display (Serif) - Elegant and premium
- **Body**: Inter (Sans-serif) - Clean and modern

## Key Features Implementation

### Shopping Cart
- Items persisted in localStorage
- Real-time quantity updates
- Cart count badge on navbar
- Order summary with totals

### Admin Dashboard
- Password-protected access
- Real-time inventory updates
- Product form with validation
- Order management interface

### Responsive Design
- Mobile-optimized layout
- Touch-friendly buttons and controls
- Flexible grid system
- Adaptive typography

### Dark Mode
- Toggle button in navbar
- Smooth color transitions
- Preserved user preference

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Local Development

Simply open `index.html` in a web browser, or use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (with http-server)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

## Data Persistence

All data is stored in the browser's localStorage:
- `aurelia_products`: Product inventory
- `aurelia_cart`: Shopping cart items
- `aurelia_wishlist`: Saved items
- `aurelia_users`: User accounts
- `aurelia_orders`: Order history
- `aurelia_theme`: Dark mode preference

## Customization

### Adding Products
In `script.js`, modify the `sampleProducts` array or use the admin panel to add new items.

### Changing Colors
Update CSS variables in `style.css` root selector:
```css
:root {
  --gold: #d4af37;
  --bg: #f4efe7;
  --text: #171411;
  /* ... */
}
```

### Brand Customization
- Replace `favicon.ico` with your brand icon
- Update `logo.png` in images folder
- Modify footer and navigation text
- Update metadata in HTML files

## Notes

- No backend server required - all data stored locally
- Safe for demo/learning purposes
- Mobile-responsive and installable as a PWA
- Optimized for luxury brand presentation

## License

Free to use and modify for personal and commercial projects.

---

**AURELIA Luxury Jewellery** - Elegance in every detail.
