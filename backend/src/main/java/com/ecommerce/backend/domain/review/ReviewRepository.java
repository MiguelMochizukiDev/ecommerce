package com.ecommerce.backend.domain.review;

import com.ecommerce.backend.domain.order.SubOrder;
import com.ecommerce.backend.domain.product.Product;
import com.ecommerce.backend.domain.seller.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProduct(Product product);
    List<Review> findBySeller(SellerProfile seller);
    boolean existsBySubOrder(SubOrder subOrder);
}
