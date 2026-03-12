package com.ecommerce.backend.domain.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateOrderRequest(
    @NotBlank(message = "Endereço de entrega é obrigatório")
    String deliveryAddress,

    @NotEmpty(message = "Deve haver ao menos uma seleção de pagamento")
    List<@Valid PaymentSelection> paymentSelections
) {}
