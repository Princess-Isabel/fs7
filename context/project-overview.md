# Project Overview

## What

This project is a full-stack e-commerce training application named **Rivanshop**. It is built with a React + Vite + Tailwind CSS frontend and a Django REST Framework backend.

The application focuses on selling networking and enterprise hardware products, especially Cisco-style switches, routers, and related devices. The backend exposes product, authentication, profile, and cart APIs, while the frontend provides customer-facing pages for browsing products, viewing product details, managing a shopping cart, logging in, registering, and viewing a protected profile page.

This documentation was created by scanning the project source while excluding the `Documentation_FST` and `venv` folders.

## Use Case

Rivanshop is designed as a learning and demonstration project for a simple online shop workflow.

Primary use cases:

- Customers can browse a product catalog.
- Customers can open a product details page to view price, stock, image, and description.
- Customers can add products to the authenticated shopping cart from the product details page.
- Customers can view a shopping cart UI with live item quantities, item removal, subtotal, total, and checkout action.
- Customers can log in with JWT-based authentication.
- Authenticated users can access a protected profile page.
- The backend includes cart APIs for adding, viewing, updating, and deleting cart items.
- The backend includes early data models for payment methods, order items, and shipping addresses, which can support checkout functionality later.

The project is useful for practicing:

- React component-based UI development.
- Client-side routing with `react-router-dom`.
- Tailwind CSS styling.
- API calls from React using `axios`.
- Django REST API design.
- JWT authentication using `djangorestframework-simplejwt`.
- Product catalog and cart data modeling.

## About the Project

### Frontend

The frontend lives in `frontend/` and uses Vite as the development/build tool.

Main frontend technologies:

- React
- Vite
- Tailwind CSS
- Axios
- React Router

Important frontend files:

- `frontend/src/App.jsx` defines the main routes.
- `frontend/src/components/Header.jsx` provides the top navigation, including links to `/cart` and `/profile` with icons.
- `frontend/src/components/Hero.jsx` renders the homepage hero section.
- `frontend/src/pages/Home.jsx` combines the hero and product listing.
- `frontend/src/pages/Products.jsx` fetches and displays products from the backend.
- `frontend/src/pages/Product_Details.jsx` fetches one product, displays product details with quantity controls, and posts authenticated add-to-cart requests.
- `frontend/src/pages/Cart.jsx` loads authenticated cart items from the backend and supports quantity updates, item removal, order summary, and checkout button.
- `frontend/src/pages/Login.jsx` authenticates users through the JWT token endpoint.
- `frontend/src/pages/Register.jsx` contains the registration form UI.
- `frontend/src/pages/Profile.jsx` renders the protected profile and purchase history layout.
- `frontend/src/api/Auth_refresh.js` wraps authorized API requests and refreshes expired access tokens with the saved refresh token.
- `frontend/src/context/AuthProvider.jsx` stores authentication state based on `localStorage`.
- `frontend/src/context/PrivateRoute.jsx` protects routes that require login.

Current frontend routes:

- `/` - Home page
- `/products` - Product catalog
- `/product/:id` - Product detail page
- `/cart` - Shopping cart page
- `/login` - Login page
- `/register` - Register page
- `/profile` - Protected profile page

### Backend

The backend lives in `backend/` and uses Django with Django REST Framework.

Main backend technologies:

- Django
- Django REST Framework
- Simple JWT authentication
- CORS headers
- PostgreSQL database configuration
- Media file handling for product images

Important backend files:

- `backend/manage.py` is the Django entry point.
- `backend/backend/settings.py` contains Django settings.
- `backend/backend/urls.py` defines project-level routes and JWT token endpoints.
- `backend/base/models.py` defines product, cart, payment, order item, and shipping address models.
- `backend/base/serializer.py` defines serializers for products, registration, users, and cart items.
- `backend/base/views.py` defines the API view functions.
- `backend/base/urls.py` maps API routes to backend views.
- `backend/products_fixture.json` contains sample product data.
- `backend/media/images/` stores product images.

Current backend API endpoints:

- `GET /products/` - list all products
- `GET /product/<id>/` - get one product by ID
- `POST /register/` - register a new user
- `POST /logout/` - blacklist a refresh token
- `GET /profile/` - return the authenticated user's profile
- `GET /cart/` - view authenticated user's cart items
- `POST /cart/add/` - add an item to cart
- `PUT /cart/update/<id>/` - update cart item quantity
- `DELETE /cart/delete/<id>/` - remove a cart item
- `POST /api/token/` - obtain JWT access and refresh tokens
- `POST /api/token/refresh/` - refresh JWT access token

### Data Model Summary

The main backend entities are:

- `Product` - stores product name, price, brand, description, stock count, image, and creation date.
- `cartUser` - stores products added to a user's cart with quantity.
- `paymentMethod` - stores payment records and PayMongo-related status fields.
- `order_item` - stores purchased product line items connected to a payment.
- `shippingAddress` - stores shipping information connected to a payment.

The product fixture data contains network device products such as Cisco Catalyst switches, Nexus switches, and ISR routers.

### Authentication Flow

The frontend login page sends credentials to `POST /api/token/`.

On successful login:

- The access token is saved to `localStorage` as `access_token`.
- The refresh token is saved to `localStorage` as `refresh_token`.
- The auth context marks the user as authenticated.
- The user is redirected to `/profile`.

The `PrivateRoute` component checks the auth context before allowing access to protected pages.

### Current Project State

The project already has the foundation for a complete e-commerce workflow:

- Product browsing is connected to the backend.
- Product detail pages are connected to the backend.
- Product detail pages can add items to the authenticated backend cart.
- The shopping cart page is connected to backend cart endpoints for viewing, updating, and deleting items.
- Login is connected to JWT authentication.
- Protected routing is available.
- Backend cart endpoints exist.
- Backend payment, order, and shipping models exist.

Some areas appear to still be in progress:

- The register page currently has UI structure but does not yet submit to the backend register endpoint.
- The profile page currently uses sample profile and purchase-history data.
- Checkout and payment flows have backend model foundations, but the checkout button is still UI-only.

### AI Development Guidance

When extending this project, keep the existing structure and conventions:

- Use React page components under `frontend/src/pages/`.
- Use reusable UI pieces under `frontend/src/components/`.
- Keep auth-related client state in `frontend/src/context/`.
- Use Tailwind utility classes for styling.
- Use `axios` for frontend API requests.
- Use Django REST Framework serializers and function-based API views for backend endpoints.
- Keep API responses aligned with the current frontend fields, especially `product_id`, `product_name`, `product_price`, `brand`, `description`, `countInStock`, and `image`.
- Avoid editing generated folders such as frontend build output, dependency folders, Python cache files, `Documentation_FST`, and `venv`.
