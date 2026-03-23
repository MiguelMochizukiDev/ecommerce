package com.ecommerce.backend.domain.order.dto;

import com.ecommerce.backend.domain.seller.PaymentMethod;
import jakarta.validation.constraints.NotNull;

public record PaymentSelection(
    @NotNull(message = "ID do vendedor é obrigatório")
    Long sellerId,

    @NotNull(message = "Método de pagamento é obrigatório")
    PaymentMethod paymentMethod
) {}
