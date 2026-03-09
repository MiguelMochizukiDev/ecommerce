package com.ecommerce.backend.domain.product.dto;

import com.ecommerce.backend.domain.product.Product;
import com.ecommerce.backend.domain.product.ProductStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponse(
    Long id,
    Long sellerId,
    String sellerStoreName,
    String categoryName,
    String name,
    String description,
    BigDecimal price,
    Integer stock,
    ProductStatus status,
    LocalDateTime createdAt
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
            p.getId(),
            p.getSeller().getId(),
            p.getSeller().getStoreName(),
            p.getCategory().getName(),
            p.getName(),
            p.getDescription(),
            p.getPrice(),
            p.getStock(),
            p.getStatus(),
            p.getCreatedAt()
        );
    }
}