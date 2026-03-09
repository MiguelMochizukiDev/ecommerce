package com.ecommerce.backend.domain.product;

import com.ecommerce.backend.domain.product.dto.ProductRequest;
import com.ecommerce.backend.domain.product.dto.ProductResponse;
import com.ecommerce.backend.domain.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // POST /api/products — cadastra produto (requer perfil de vendedor)
    @PostMapping
    public ResponseEntity<ProductResponse> create(
            @Valid @RequestBody ProductRequest request,
            Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.create(currentUser, request));
    }

    // GET /api/products — lista todos os produtos ativos (público)
    @GetMapping
    public ResponseEntity<List<ProductResponse>> listActive() {
        return ResponseEntity.ok(productService.listActive());
    }

    // GET /api/products/{id} — detalhe de um produto (público)
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    // GET /api/products/my — produtos do vendedor logado
    @GetMapping("/my")
    public ResponseEntity<List<ProductResponse>> myProducts(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(productService.listMyProducts(currentUser));
    }
}