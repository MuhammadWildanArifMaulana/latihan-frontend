# Product Management App

A full-stack web application for managing products with authentication and CRUD operations.

## Struktur Penting

# Product Management App 📦

> Aplikasi web pengelolaan produk dengan autentikasi dan CRUD operations.

## Teknologi 🛠️

- **Frontend:** React, Bootstrap, Axios
- **Backend:** Node.js, MySQL + JWT

## Fitur ⭐

- Login/Register
- CRUD Produk & Kategori
- Protected Routes
- Responsive Design

## Instalasi 🚀

```bash
# Install & jalankan frontend
npm install
npm start

# Install & jalankan backend
cd server
npm install
cp .env.example .env  # Setup environment
npm start
```

## API Endpoints 🔌

```plaintext
# Auth
POST /auth/register  - Register
POST /auth/login     - Login

# Products
GET    /products     - List produk
POST   /products     - Tambah produk
PUT    /products/:id - Update produk
DELETE /products/:id - Hapus produk

# Categories
GET /categories      - List kategori
```

## Lisensi 📜

MIT

## Features

- User Authentication (Register/Login)
- Product Management (Create, Read, Update, Delete)
- Category Management
- Protected Routes
- Responsive Design with React Bootstrap

## Tech Stack

### Frontend

- React.js
- React Router v6
- React Bootstrap
- Axios

### Backend

- Node.js
- Express.js
- MySQL
- JWT Authentication

## Project Structure

```
src/
├── api/              # API dan autentikasi
├── components/       # Komponen yang dapat digunakan ulang
│   ├── PrivateRoute.js  # Proteksi route dashboard
│   └── PublicRoute.js   # Proteksi route login/register
├── pages/           # Halaman utama
│   ├── Dashboard.js  # Halaman pengelolaan produk
│   ├── Login.js      # Halaman login
│   └── Register.js   # Halaman registrasi
└── App.js          # Konfigurasi routing

server/             # Backend
├── .env           # Konfigurasi database & JWT
└── index.js       # Entry point server
```

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/MuhammadWildanArifMaulana/latihan-frontend
cd latihan-frontend
```

2. Install dependencies:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Setup environment variables:

- Create .env file in server folder
- Add required environment variables (see .env.example)

4. Start the application:

```bash
# Start backend server (from server directory)
npm run start

# Start frontend development server (from root directory)
npm start
```

## Usage

1. Register a new account
2. Login with your credentials
3. Access the dashboard to manage products:
   - View all products
   - Add new products
   - Edit existing products
   - Delete products
   - Categorize products

## API Endpoints

### Authentication

- POST /auth/register - Register new user
- POST /auth/login - User login

### Products

- GET /products - Get all products
- POST /products - Create new product
- PUT /products/:id - Update product
- DELETE /products/:id - Delete product

### Categories

- GET /categories - Get all categories

## Available Scripts

- `npm start` - Run development server
- `npm run build` - Build for production

## Contributors

Muhammad Wildan Arif Maulana

## License

This project is licensed under the MIT License.
