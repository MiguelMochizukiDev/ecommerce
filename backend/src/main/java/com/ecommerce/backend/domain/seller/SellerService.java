package com.ecommerce.backend.domain.seller;

import com.ecommerce.backend.domain.seller.dto.SellerRequest;
import com.ecommerce.backend.domain.seller.dto.SellerResponse;
import com.ecommerce.backend.domain.user.Role;
import com.ecommerce.backend.domain.user.User;
import com.ecommerce.backend.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SellerService {

    private final SellerRepository sellerRepository;
    private final UserRepository userRepository;

    @Transactional /* Create profile and update user role are atomic operations */
    public SellerResponse activateSellerProfile(User currentUser, SellerRequest request) {

        if (sellerRepository.existsByUser(currentUser)) {
            throw new IllegalStateException("Usuário já possui perfil de vendedor");
        }

        if (request.paymentMethods().contains(PaymentMethod.PIX) &&
            (request.pixKey() == null || request.pixKey().isBlank())) {
            throw new IllegalArgumentException("Chave PIX é obrigatória quando PIX é um método de pagamento");
        }

        SellerProfile profile = SellerProfile.builder()
                .user(currentUser)
                .storeName(request.storeName())
                .description(request.description())
                .paymentMethods(request.paymentMethods())
                .pixKey(request.pixKey())
                .build();

        sellerRepository.save(profile);

        currentUser.getRoles().add(Role.SELLER);
        userRepository.save(currentUser);

        return SellerResponse.from(profile);
    }

    public SellerResponse getMySellerProfile(User currentUser) {
        return sellerRepository.findByUser(currentUser)
                .map(SellerResponse::from)
                .orElseThrow(() -> new IllegalStateException("Usuário não possui perfil de vendedor"));
    }
}