package com.ecommerce.backend.domain.product;

import com.ecommerce.backend.domain.category.Category;
import com.ecommerce.backend.domain.category.CategoryRepository;
import com.ecommerce.backend.domain.product.dto.ProductRequest;
import com.ecommerce.backend.domain.product.dto.ProductResponse;
import com.ecommerce.backend.domain.seller.SellerProfile;
import com.ecommerce.backend.domain.seller.SellerRepository;
import com.ecommerce.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private final CategoryRepository categoryRepository;

    public ProductResponse create(User currentUser, ProductRequest request) {

        // Regra 1: usuário deve ter perfil de vendedor
        SellerProfile seller = sellerRepository.findByUser(currentUser)
                .orElseThrow(() -> new IllegalStateException(
                    "Você precisa ativar seu perfil de vendedor antes de cadastrar produtos"));

        // Regra 2: categoria deve existir
        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new IllegalArgumentException(
                    "Categoria não encontrada: " + request.categoryId()));

        Product product = Product.builder()
                .seller(seller)
                .category(category)
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .stock(request.stock())
                .build();

        return ProductResponse.from(productRepository.save(product));
    }

    public List<ProductResponse> listActive() {
        return productRepository.findByStatus(ProductStatus.ACTIVE)
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public List<ProductResponse> listMyProducts(User currentUser) {
        SellerProfile seller = sellerRepository.findByUser(currentUser)
                .orElseThrow(() -> new IllegalStateException("Usuário não possui perfil de vendedor"));

        // Lista todos exceto DELETED
        return productRepository.findBySellerAndStatusNot(seller, ProductStatus.DELETED)
                .stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse getById(Long id) {
        return productRepository.findById(id)
                .filter(p -> p.getStatus() != ProductStatus.DELETED)
                .map(ProductResponse::from)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado: " + id));
    }
}