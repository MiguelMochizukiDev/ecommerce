package com.ecommerce.backend.domain.order.dto;

import com.ecommerce.backend.domain.order.Order;
import com.ecommerce.backend.domain.order.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public record OrderResponse(
    Long id,
    OrderStatus status,
    String deliveryAddress,
    BigDecimal total,
    LocalDateTime createdAt,
    List<SubOrderResponse> subOrders
) {
    public static OrderResponse from(Order order) {
        List<SubOrderResponse> subOrdersDto = order.getSubOrders().stream()
            .map(SubOrderResponse::from)
            .collect(Collectors.toList());

        return new OrderResponse(
            order.getId(),
            order.getStatus(),
            order.getDeliveryAddress(),
            order.getTotal(),
            order.getCreatedAt(),
            subOrdersDto
        );
    }
}
