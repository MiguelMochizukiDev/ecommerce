package com.ecommerce.backend.domain.product;

import com.ecommerce.backend.domain.seller.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Produtos de um vendedor específico
    List<Product> findBySellerAndStatusNot(SellerProfile seller, ProductStatus status);

    // Todos os produtos ativos (para listagem pública)
    List<Product> findByStatus(ProductStatus status);

    // Produtos ativos de uma categoria
    List<Product> findByCategoryIdAndStatus(Long categoryId, ProductStatus status);
}