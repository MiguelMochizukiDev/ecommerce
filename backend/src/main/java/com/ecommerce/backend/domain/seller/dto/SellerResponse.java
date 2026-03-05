package com.ecommerce.backend.domain.seller.dto;

import com.ecommerce.backend.domain.seller.PaymentMethod;
import com.ecommerce.backend.domain.seller.SellerProfile;

import java.time.LocalDateTime;
import java.util.Set;

public record SellerResponse(
    Long id,
    Long userId,
    String storeName,
    String description,
    String pixKey,
    Set<PaymentMethod> paymentMethods,
    boolean active,
    LocalDateTime createdAt
) {
    public static SellerResponse from(SellerProfile profile) {
        return new SellerResponse(
            profile.getId(),
            profile.getUser().getId(),
            profile.getStoreName(),
            profile.getDescription(),
            profile.getPixKey(),
            profile.getPaymentMethods(),
            profile.isActive(),
            profile.getCreatedAt()
        );
    }
}