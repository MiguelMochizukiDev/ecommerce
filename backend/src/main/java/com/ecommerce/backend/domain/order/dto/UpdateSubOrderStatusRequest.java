package com.ecommerce.backend.domain.order.dto;

import com.ecommerce.backend.domain.order.SubOrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateSubOrderStatusRequest(
    @NotNull(message = "Status é obrigatório")
    SubOrderStatus status,

    String note
) {}
