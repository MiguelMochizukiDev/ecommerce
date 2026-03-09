package com.ecommerce.backend.domain.category.dto;

import com.ecommerce.backend.domain.category.Category;

public record CategoryResponse(Long id, String name, String description) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(c.getId(), c.getName(), c.getDescription());
    }
}