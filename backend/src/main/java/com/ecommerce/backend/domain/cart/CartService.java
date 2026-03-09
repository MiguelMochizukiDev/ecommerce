package com.ecommerce.backend.domain.cart;

import com.ecommerce.backend.domain.cart.dto.AddItemRequest;
import com.ecommerce.backend.domain.cart.dto.CartResponse;
import com.ecommerce.backend.domain.cart.dto.UpdateItemRequest;
import com.ecommerce.backend.domain.product.Product;
import com.ecommerce.backend.domain.product.ProductRepository;
import com.ecommerce.backend.domain.product.ProductStatus;
import com.ecommerce.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    // Busca o carrinho do usuário, ou cria um novo se não existir
    private Cart getOrCreate(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(
                    Cart.builder().user(user).build()
                ));
    }

    public CartResponse getCart(User user) {
        return CartResponse.from(getOrCreate(user));
    }

    @Transactional
    public CartResponse addItem(User user, AddItemRequest request) {
        Cart cart = getOrCreate(user);

        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado"));

        if (product.getStatus() != ProductStatus.ACTIVE) {
            throw new IllegalStateException("Produto não está disponível para compra");
        }

        if (product.getSeller().getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Você não pode comprar seu próprio produto");
        }

        if (request.quantity() > product.getStock()) {
            throw new IllegalStateException(
                "Quantidade solicitada (" + request.quantity() +
                ") excede o estoque disponível (" + product.getStock() + ")"
            );
        }

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .map(existing -> {
                    int newQty = existing.getQuantity() + request.quantity();
                    if (newQty > product.getStock()) {
                        throw new IllegalStateException(
                            "Quantidade total (" + newQty +
                            ") excederia o estoque (" + product.getStock() + ")"
                        );
                    }
                    existing.setQuantity(newQty);
                    return existing;
                })
                .orElseGet(() -> CartItem.builder()
                        .cart(cart)
                        .product(product)
                        .quantity(request.quantity())
                        .priceSnapshot(product.getPrice())
                        .build()
                );

        cartItemRepository.save(item);

        return CartResponse.from(cartRepository.findByUser(user).orElseThrow());
    }

    @Transactional
    public CartResponse updateItem(User user, Long itemId, UpdateItemRequest request) {
        Cart cart = getOrCreate(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalStateException("Item não pertence ao seu carrinho");
        }

        if (request.quantity() > item.getProduct().getStock()) {
            throw new IllegalStateException("Quantidade excede o estoque disponível");
        }

        item.setQuantity(request.quantity());
        cartItemRepository.save(item);

        return CartResponse.from(cartRepository.findByUser(user).orElseThrow());
    }

    @Transactional
    public CartResponse removeItem(User user, Long itemId) {
        Cart cart = getOrCreate(user);

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item não encontrado"));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new IllegalStateException("Item não pertence ao seu carrinho");
        }

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        return CartResponse.from(cartRepository.findByUser(user).orElseThrow());
    }

    @Transactional
    public void clearCart(User user) {
        Cart cart = getOrCreate(user);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}