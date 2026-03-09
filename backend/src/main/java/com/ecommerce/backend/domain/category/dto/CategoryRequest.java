package com.ecommerce.backend.domain.category.dto;

import jakarta.validation.constraints.NotBlank;

public record CategoryRequest(
    @NotBlank(message = "Nome da categoria é obrigatório")
    String name,
    String description
) {}