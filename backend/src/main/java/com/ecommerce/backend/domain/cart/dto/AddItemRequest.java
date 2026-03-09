package com.ecommerce.backend.domain.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record AddItemRequest(
    @NotNull(message = "Produto é obrigatório")
    Long productId,

    @NotNull
    @Min(value = 1, message = "Quantidade mínima é 1")
    Integer quantity
) {}