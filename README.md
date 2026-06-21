# 🛒 ShopSync

ShopSync is a full-stack inventory and order management application built using React, Spring Boot, Spring Data JPA, and H2 Database.

The application allows users to add multiple products to a cart, manage quantities and prices, and store product information in a database through REST APIs.

---

## 🚀 Features

* Add multiple products before placing an order
* Manage product name, price, and quantity
* Store product data in a database
* RESTful API integration
* Real-time frontend and backend communication
* H2 Database support for development and testing
* Responsive and user-friendly interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* JavaScript (ES6+)
* CSS3
* Vite

### Backend

* Spring Boot
* Spring Data JPA
* Hibernate
* REST APIs

### Database

* H2 Database

---

## 📂 Project Structure

```text
ShopSync
│
├── frontend
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   └── package.json
│
├── backend
│   ├── controller
│   ├── entity
│   ├── repository
│   ├── application.properties
│   └── ShopSyncApplication.java
│
└── README.md
```

## ⚙️ Setup Instructions

### Clone Repository

```bash
git clone https://github.com/your-username/shopsync.git
cd shopsync
```

### Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

## 📡 API Endpoints

### Get All Products

```http
GET /products
```

### Add Product

```http
POST /products
```

Request Body:

```json
{
  "name": "Aata",
  "price": 500,
  "quantity": 20
}
```

---

## 🗄️ Database Access

H2 Console:

```text
http://localhost:8080/h2-console
```

JDBC URL:

```text
jdbc:h2:mem:shopsyncdb
```

Username:

```text
sa
```

Password:

```text
password
```

Example Query:

```sql
SELECT * FROM PRODUCT;
```

---

## 🎯 Learning Outcomes

This project helped in understanding:

* React State Management
* REST API Integration
* Spring Boot Development
* JPA & Hibernate
* Database Operations
* Frontend-Backend Communication
* CRUD Operations

---

## 🔮 Future Improvements

* Authentication & Authorization
* Order Management Module
* Product Search & Filters
* Inventory Tracking
* MySQL/PostgreSQL Integration
* Dashboard Analytics
* Deployment on Cloud

---

## 👨‍💻 Author

Amit Mishra

B.Tech CSE (Data Science)

Aspiring Full Stack Developer | Java Developer | AI Enthusiast
