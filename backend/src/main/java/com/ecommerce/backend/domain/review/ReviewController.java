package com.ecommerce.backend.domain.review;

import com.ecommerce.backend.domain.review.dto.ReviewRequest;
import com.ecommerce.backend.domain.review.dto.ReviewResponse;
import com.ecommerce.backend.domain.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/sub-orders/{subOrderId}")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long subOrderId,
            @Valid @RequestBody ReviewRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(reviewService.createReview(user, subOrderId, request));
    }

    @GetMapping("/products/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId));
    }

    @GetMapping("/sellers/{sellerId}")
    public ResponseEntity<List<ReviewResponse>> getSellerReviews(@PathVariable Long sellerId) {
        return ResponseEntity.ok(reviewService.getReviewsBySeller(sellerId));
    }
}
