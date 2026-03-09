package com.ecommerce.backend.domain.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record UpdateItemRequest(
    @NotNull
    @Min(value = 1, message = "Quantidade mínima é 1")
    Integer quantity
) {}