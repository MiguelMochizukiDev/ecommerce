package com.ecommerce.backend.domain.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ReviewRequest(
    @NotNull(message = "Nota do produto é obrigatória")
    @Min(value = 1, message = "Nota do produto deve ser entre 1 e 5")
    @Max(value = 5, message = "Nota do produto deve ser entre 1 e 5")
    Integer productRating,

    @NotNull(message = "Nota do vendedor é obrigatória")
    @Min(value = 1, message = "Nota do vendedor deve ser entre 1 e 5")
    @Max(value = 5, message = "Nota do vendedor deve ser entre 1 e 5")
    Integer sellerRating,

    String comment
) {}
