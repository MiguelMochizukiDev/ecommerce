package com.ecommerce.backend.domain.category;

import com.ecommerce.backend.domain.category.dto.CategoryRequest;
import com.ecommerce.backend.domain.category.dto.CategoryResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    // POST /api/categories — cria categoria (requer autenticação)
    @PostMapping
    public ResponseEntity<CategoryResponse> create(@Valid @RequestBody CategoryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryService.create(request));
    }

    // GET /api/categories — lista todas (público)
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> listAll() {
        return ResponseEntity.ok(categoryService.listAll());
    }
}