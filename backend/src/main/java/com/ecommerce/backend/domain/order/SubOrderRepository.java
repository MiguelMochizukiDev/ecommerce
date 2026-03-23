package com.ecommerce.backend.domain.order;

import com.ecommerce.backend.domain.seller.SellerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubOrderRepository extends JpaRepository<SubOrder, Long> {
    List<SubOrder> findBySellerOrderByOrderCreatedAtDesc(SellerProfile seller);
}
