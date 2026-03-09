# E-Commerce Backend

A RESTful backend for an e-commerce platform built with **Java 21** and **Spring Boot 3.5**, featuring JWT authentication, role-based access control, and a domain-driven package structure.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot 3.5 |
| Security | Spring Security + JWT (JJWT 0.12.6) |
| Persistence | Spring Data JPA + Hibernate 6 |
| Database | MySQL 8 |
| Build Tool | Maven (via `mvnw` wrapper) |
| Utilities | Lombok, Bean Validation |

---

## Project Structure

```
src/main/java/com/ecommerce/backend/
│
├── config/                    # Security, JWT filter, password encoder
│   ├── JwtAuthFilter.java
│   ├── PasswordConfig.java
│   └── SecurityConfig.java
│
├── domain/                    # Business logic organized by domain
│   ├── category/              # Product categories
│   ├── product/               # Products and inventory
│   ├── seller/                # Seller profiles and payment methods
│   └── user/                  # Users, roles, auth
│
└── infra/
    └── security/
        └── JwtService.java    # Token generation and validation
```

Each domain package follows the same layered structure:

```
{domain}/
├── {Entity}.java              # JPA entity → database table
├── {Entity}Repository.java    # Data access (Spring Data JPA)
├── {Entity}Service.java       # Business rules
├── {Entity}Controller.java    # HTTP endpoints
└── dto/
    ├── {Entity}Request.java   # Input (validated)
    └── {Entity}Response.java  # Output (no sensitive fields)
```

---

## Getting Started

### Prerequisites

- Java 21+
- MySQL 8+
- Maven (or use the included `./mvnw` wrapper)

### 1. Clone and configure

```bash
git clone <repo-url>
cd backend
```

Create the database:

```sql
CREATE DATABASE ecommerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Set environment variables

```bash
export DB_USER=your_mysql_user
export DB_PASSWORD=your_mysql_password
export JWT_SECRET=your-secret-key-at-least-32-characters
```

> **Tip:** Add these to your `~/.bashrc` to persist across sessions.

### 3. Run

```bash
./mvnw spring-boot:run
```

The server starts on `http://localhost:8080`.

---

## Authentication

The API uses **stateless JWT authentication**. Every protected endpoint requires:

```
Authorization: Bearer <token>
```

Tokens are obtained via the login endpoint and expire after **24 hours**.

### Login flow

```bash
# Register
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice", "email": "alice@email.com", "password": "senha123"}'

# Login → get token
TOKEN=$(curl -s -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@email.com", "password": "senha123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
```

---

## API Reference

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT token |
| GET | `/me` | Required | Get authenticated user's data |

### Seller Profiles — `/api/seller`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/activate` | Required | Activate seller profile |
| GET | `/me` | Required | Get own seller profile |

### Categories — `/api/categories`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Required | Create a new category |
| GET | `/` | Public | List all categories |

### Products — `/api/products`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Required | Create a product (seller only) |
| GET | `/` | Public | List all active products |
| GET | `/{id}` | Public | Get product by ID |
| GET | `/my` | Required | List own products |

---

## User Roles

| Role | Description |
|------|-------------|
| `BUYER` | Default role for all registered users |
| `SELLER` | Granted when a user activates a seller profile |
| `ADMIN` | Platform administrator |

Roles are **additive** — a seller also has the `BUYER` role and can purchase products from other sellers. A user cannot buy their own products.

---

## Payment Methods

Sellers define which payment methods they accept. Buyers must choose from the available options for each seller.

| Method | Notes |
|--------|-------|
| `DINHEIRO` | Cash on delivery |
| `DEBITO` | Debit card |
| `CREDITO` | Credit card |
| `PIX` | Requires seller to provide a `pixKey` |

---

## Database Schema

```
users
 └── user_roles          (BUYER, SELLER, ADMIN)

seller_profiles
 └── seller_payment_methods

categories

products
 ├── seller_profiles
 └── categories
```

---

## Roadmap

```
[x] User registration and authentication (JWT)
[x] Seller profile with payment methods
[x] Products and categories
[ ] Shopping cart
[ ] Orders and sub-orders (per seller)
[ ] Product reviews
[ ] Transaction history
```

---

## Configuration Reference

All configuration lives in `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db?...
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=update   # Use 'validate' in production
spring.jpa.show-sql=true

# JWT
jwt.secret=${JWT_SECRET}               # Min 32 characters
jwt.expiration=86400000                # 24 hours in milliseconds
```

> Never commit real credentials to version control. Add `application.properties` to `.gitignore` if using hardcoded values.