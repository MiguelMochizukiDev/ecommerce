package com.ecommerce.backend.domain.order.dto;

import java.math.BigDecimal;

public record SubOrderItemResponse(
    Long id,
    Long productId,
    String productName,
    Integer quantity,
    BigDecimal priceSnapshot,
    BigDecimal itemTotal
) {}
