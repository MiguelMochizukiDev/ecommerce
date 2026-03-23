package com.ecommerce.backend.domain.review.dto;

import com.ecommerce.backend.domain.review.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
    Long id,
    Long subOrderId,
    String reviewerName,
    Long productId,
    String productName,
    Long sellerId,
    String sellerStoreName,
    Integer productRating,
    Integer sellerRating,
    String comment,
    LocalDateTime createdAt
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
            review.getId(),
            review.getSubOrder().getId(),
            review.getReviewer().getName(),
            review.getProduct().getId(),
            review.getProduct().getName(),
            review.getSeller().getId(),
            review.getSeller().getStoreName(),
            review.getProductRating(),
            review.getSellerRating(),
            review.getComment(),
            review.getCreatedAt()
        );
    }
}
