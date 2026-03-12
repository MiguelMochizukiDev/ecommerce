package com.ecommerce.backend.domain.order.dto;

import com.ecommerce.backend.domain.order.SubOrder;
import com.ecommerce.backend.domain.seller.PaymentMethod;
import com.ecommerce.backend.domain.order.SubOrderStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

public record SubOrderResponse(
    Long id,
    Long sellerId,
    String sellerStoreName,
    PaymentMethod paymentMethod,
    SubOrderStatus status,
    BigDecimal subtotal,
    List<SubOrderItemResponse> items
) {
    public static SubOrderResponse from(SubOrder subOrder) {
        List<SubOrderItemResponse> itemsDto = subOrder.getItems().stream()
            .map(item -> new SubOrderItemResponse(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getQuantity(),
                item.getPriceSnapshot(),
                item.getPriceSnapshot().multiply(BigDecimal.valueOf(item.getQuantity()))
            ))
            .collect(Collectors.toList());

        return new SubOrderResponse(
            subOrder.getId(),
            subOrder.getSeller().getId(),
            subOrder.getSeller().getStoreName(),
            subOrder.getPaymentMethod(),
            subOrder.getStatus(),
            subOrder.getSubtotal(),
            itemsDto
        );
    }
}
