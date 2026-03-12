# E-commerce Domain Documentation

## Project Overview

This is a **Multi-Seller E-commerce Backend** built with **Java Spring Boot**. The platform allows:

- **Users** to register as buyers, sellers, or both
- **Sellers** to list products and manage their store
- **Buyers** to browse products, add to cart, and place orders
- **Orders** to be split into sub-orders (one per seller) for independent fulfillment
- **Reviews** for both products and sellers after order completion

## UML Diagrams

The documentation is organized into modular diagrams for clarity:

### System Architecture

#### 1. System Overview (`overview.puml`)
High-level package diagram showing the main modules and their dependencies. Start here to understand the overall system structure.

#### 2. Order Process Flow (`action.puml`)
Activity diagram showing the complete order workflow from browsing to review. Illustrates how orders are split into SubOrders for parallel fulfillment by different sellers.

### Domain Models

Each domain is documented in its own UML class diagram:

#### 3. User & Seller Domain (`user-seller-domain.puml`)
- User entity with roles
- SellerProfile (users can be sellers)
- One-to-one relationship

#### 4. Product Catalog Domain (`product-catalog-domain.puml`)
- Category entity
- Product entity with price, stock, status
- Products belong to categories and sellers

#### 5. Shopping Cart Domain (`cart-shopping-domain.puml`)
- Cart (one per user)
- CartItem with quantity and price snapshot
- References products

#### 6. Order Domain (`order-domain.puml`)
- Order entity (buyer places order)
- SubOrder (split by seller)
- SubOrderItem (with price snapshot)
- Shows multi-seller order splitting architecture

#### 7. Review Domain (`review-domain.puml`)
- Review entity with product and seller ratings
- Linked to SubOrder, Product, Seller, and User

### Database Schema

#### 8. Entity-Relationship Diagram (`entity-relationship.puml`)
Complete database schema showing all tables, columns, primary keys, foreign keys, and relationships. Useful for understanding the physical data model.

## Core Concepts

### Multi-Seller Architecture

- A `Product` belongs to one `SellerProfile`
- When a buyer places an `Order` with products from multiple sellers, the system creates separate `SubOrder` entities
- Each `SubOrder` has independent payment method and status tracking
- Sellers only see their own `SubOrder` items

### Price Snapshots

- `CartItem` and `SubOrderItem` store `priceSnapshot` (the price at the time of action)
- This ensures historical accuracy even if product prices change later

### Review System

- Reviews are tied to a specific `SubOrder`
- Each review rates both the `Product` and the `SellerProfile`
- Ratings are 1-5 integers

## Viewing the Diagrams

To render these PlantUML diagrams:

1. **VS Code**: Install the PlantUML extension
2. **Online**: Use [PlantUML Online Editor](https://www.plantuml.com/plantuml/)
3. **Command Line**: Use PlantUML jar file

```bash
java -jar plantuml.jar docs/*.puml
```

## Technology Stack

- **Java 17+**
- **Spring Boot** (Web, Data JPA, Security)
- **JWT Authentication**
- **Maven**
- **JPA/Hibernate**
- **Lombok**
