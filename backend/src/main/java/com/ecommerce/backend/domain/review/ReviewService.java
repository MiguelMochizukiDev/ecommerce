package com.ecommerce.backend.domain.review;

import com.ecommerce.backend.domain.order.SubOrder;
import com.ecommerce.backend.domain.order.SubOrderRepository;
import com.ecommerce.backend.domain.order.SubOrderStatus;
import com.ecommerce.backend.domain.product.Product;
import com.ecommerce.backend.domain.product.ProductRepository;
import com.ecommerce.backend.domain.review.dto.ReviewRequest;
import com.ecommerce.backend.domain.review.dto.ReviewResponse;
import com.ecommerce.backend.domain.seller.SellerProfile;
import com.ecommerce.backend.domain.seller.SellerRepository;
import com.ecommerce.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final SubOrderRepository subOrderRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;

    @Transactional
    public ReviewResponse createReview(User user, Long subOrderId, ReviewRequest request) {
        SubOrder subOrder = subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sub-pedido não encontrado"));

        // Valida que o usuário é o comprador
        if (!subOrder.getOrder().getBuyer().getId().equals(user.getId())) {
            throw new IllegalStateException("Você não pode avaliar este pedido");
        }

        // Valida que o pedido foi entregue
        if (subOrder.getStatus() != SubOrderStatus.DELIVERED) {
            throw new IllegalStateException("Apenas pedidos entregues podem ser avaliados");
        }

        // Valida que ainda não foi avaliado
        if (reviewRepository.existsBySubOrder(subOrder)) {
            throw new IllegalStateException("Este pedido já foi avaliado");
        }

        // Para simplificar, vamos pegar o primeiro produto do sub-pedido
        // Em uma aplicação real, seria ideal ter uma avaliação para cada produto
        if (subOrder.getItems().isEmpty()) {
            throw new IllegalStateException("Sub-pedido não possui itens");
        }

        Product product = subOrder.getItems().get(0).getProduct();
        SellerProfile seller = subOrder.getSeller();

        Review review = Review.builder()
                .subOrder(subOrder)
                .reviewer(user)
                .product(product)
                .seller(seller)
                .productRating(request.productRating())
                .sellerRating(request.sellerRating())
                .comment(request.comment())
                .build();

        reviewRepository.save(review);

        return ReviewResponse.from(review);
    }

    public List<ReviewResponse> getReviewsByProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

        List<Review> reviews = reviewRepository.findByProduct(product);
        return reviews.stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }

    public List<ReviewResponse> getReviewsBySeller(Long sellerId) {
        SellerProfile seller = sellerRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Vendedor não encontrado"));

        List<Review> reviews = reviewRepository.findBySeller(seller);
        return reviews.stream()
                .map(ReviewResponse::from)
                .collect(Collectors.toList());
    }
}
