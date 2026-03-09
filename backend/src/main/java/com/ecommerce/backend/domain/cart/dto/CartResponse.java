package com.ecommerce.backend.domain.cart.dto;

import com.ecommerce.backend.domain.cart.Cart;

import java.math.BigDecimal;
import java.util.List;

public record CartResponse(
    Long id,
    List<CartItemResponse> items,
    BigDecimal total,
    boolean hasAnyDivergence   // avisa se algum preço mudou
) {
    public static CartResponse from(Cart cart) {
        List<CartItemResponse> itemResponses = cart.getItems()
                .stream()
                .map(CartItemResponse::from)
                .toList();

        BigDecimal total = itemResponses.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        boolean hasAnyDivergence = itemResponses.stream()
                .anyMatch(CartItemResponse::hasDivergence);

        return new CartResponse(cart.getId(), itemResponses, total, hasAnyDivergence);
    }
}