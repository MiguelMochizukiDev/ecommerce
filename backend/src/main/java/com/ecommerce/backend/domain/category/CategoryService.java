package com.ecommerce.backend.domain.category;

import com.ecommerce.backend.domain.category.dto.CategoryRequest;
import com.ecommerce.backend.domain.category.dto.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByName(request.name())) {
            throw new IllegalArgumentException("Categoria já existe: " + request.name());
        }
        Category category = Category.builder()
                .name(request.name())
                .description(request.description())
                .build();
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public List<CategoryResponse> listAll() {
        return categoryRepository.findAll()
                .stream()
                .map(CategoryResponse::from)
                .toList();
    }
}