package com.ecommerce.backend.domain.cart.dto;

import com.ecommerce.backend.domain.cart.CartItem;

import java.math.BigDecimal;

public record CartItemResponse(
    Long id,
    Long productId,
    String productName,
    String sellerStoreName,
    Integer quantity,
    BigDecimal priceSnapshot,   // Preço quando foi adicionado
    BigDecimal currentPrice,    // Preço atual do produto
    boolean hasDivergence,      // true se o preço mudou
    BigDecimal subtotal
) {
    public static CartItemResponse from(CartItem item) {
        return new CartItemResponse(
            item.getId(),
            item.getProduct().getId(),
            item.getProduct().getName(),
            item.getProduct().getSeller().getStoreName(),
            item.getQuantity(),
            item.getPriceSnapshot(),
            item.getProduct().getPrice(),
            item.hasPriceDivergence(),
            item.getSubtotal()
        );
    }
}