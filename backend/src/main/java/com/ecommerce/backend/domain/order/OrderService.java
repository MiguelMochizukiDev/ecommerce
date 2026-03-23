package com.ecommerce.backend.domain.order;

import com.ecommerce.backend.domain.cart.Cart;
import com.ecommerce.backend.domain.cart.CartItem;
import com.ecommerce.backend.domain.cart.CartRepository;
import com.ecommerce.backend.domain.order.dto.CreateOrderRequest;
import com.ecommerce.backend.domain.order.dto.OrderResponse;
import com.ecommerce.backend.domain.order.dto.PaymentSelection;
import com.ecommerce.backend.domain.order.dto.SubOrderResponse;
import com.ecommerce.backend.domain.order.dto.UpdateSubOrderStatusRequest;
import com.ecommerce.backend.domain.product.Product;
import com.ecommerce.backend.domain.product.ProductRepository;
import com.ecommerce.backend.domain.seller.PaymentMethod;
import com.ecommerce.backend.domain.seller.SellerProfile;
import com.ecommerce.backend.domain.seller.SellerRepository;
import com.ecommerce.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final SubOrderRepository subOrderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;

    @Transactional
    public OrderResponse createFromCart(User user, CreateOrderRequest request) {
        // Busca carrinho do usuário
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Carrinho vazio"));

        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Carrinho vazio");
        }

        // Agrupa itens por vendedor
        Map<Long, List<CartItem>> itemsBySeller = cart.getItems().stream()
                .collect(Collectors.groupingBy(item -> item.getProduct().getSeller().getId()));

        // Cria mapa de seleções de pagamento
        Map<Long, PaymentMethod> paymentMap = request.paymentSelections().stream()
                .collect(Collectors.toMap(
                    PaymentSelection::sellerId,
                    PaymentSelection::paymentMethod
                ));

        // Valida que todas as seleções de pagamento foram fornecidas
        for (Long sellerId : itemsBySeller.keySet()) {
            if (!paymentMap.containsKey(sellerId)) {
                throw new IllegalArgumentException(
                    "Método de pagamento não definido para vendedor ID: " + sellerId
                );
            }
        }

        // Cria o pedido principal
        Order order = Order.builder()
                .buyer(user)
                .deliveryAddress(request.deliveryAddress())
                .status(OrderStatus.PENDING)
                .total(BigDecimal.ZERO)
                .build();

        orderRepository.save(order);

        List<SubOrder> subOrders = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // Cria um sub-pedido para cada vendedor
        for (Map.Entry<Long, List<CartItem>> entry : itemsBySeller.entrySet()) {
            Long sellerId = entry.getKey();
            List<CartItem> items = entry.getValue();

            SellerProfile seller = sellerRepository.findById(sellerId)
                    .orElseThrow(() -> new IllegalArgumentException("Vendedor não encontrado"));

            PaymentMethod paymentMethod = paymentMap.get(sellerId);

            // Valida que o vendedor aceita o método de pagamento
            if (!seller.getPaymentMethods().contains(paymentMethod)) {
                throw new IllegalArgumentException(
                    "Vendedor " + seller.getStoreName() + " não aceita " + paymentMethod
                );
            }

            // Se for PIX, valida que o vendedor tem chave PIX
            if (paymentMethod == PaymentMethod.PIX &&
                (seller.getPixKey() == null || seller.getPixKey().isBlank())) {
                throw new IllegalStateException(
                    "Vendedor " + seller.getStoreName() + " não possui chave PIX cadastrada"
                );
            }

            SubOrder subOrder = SubOrder.builder()
                    .order(order)
                    .seller(seller)
                    .paymentMethod(paymentMethod)
                    .status(SubOrderStatus.AWAITING_PAYMENT)
                    .subtotal(BigDecimal.ZERO)
                    .build();

            subOrderRepository.save(subOrder);

            BigDecimal subtotal = BigDecimal.ZERO;
            List<SubOrderItem> subOrderItems = new ArrayList<>();

            for (CartItem cartItem : items) {
                Product product = cartItem.getProduct();

                // Valida estoque
                if (cartItem.getQuantity() > product.getStock()) {
                    throw new IllegalStateException(
                        "Produto " + product.getName() + " não tem estoque suficiente"
                    );
                }

                // Atualiza estoque
                product.setStock(product.getStock() - cartItem.getQuantity());
                product.updateStock(product.getStock());
                productRepository.save(product);

                // Cria item do sub-pedido
                SubOrderItem subOrderItem = SubOrderItem.builder()
                        .subOrder(subOrder)
                        .product(product)
                        .quantity(cartItem.getQuantity())
                        .priceSnapshot(product.getPrice()) // Usa preço atual, não o snapshot do carrinho
                        .build();

                subOrderItems.add(subOrderItem);

                BigDecimal itemTotal = product.getPrice()
                        .multiply(BigDecimal.valueOf(cartItem.getQuantity()));
                subtotal = subtotal.add(itemTotal);
            }

            subOrder.setItems(subOrderItems);
            subOrder.setSubtotal(subtotal);
            subOrderRepository.save(subOrder);

            // Registra histórico inicial
            SubOrderStatusHistory history = SubOrderStatusHistory.builder()
                    .subOrder(subOrder)
                    .status(SubOrderStatus.AWAITING_PAYMENT)
                    .note("Pedido criado")
                    .build();
            subOrder.getStatusHistory().add(history);
            subOrderRepository.save(subOrder);

            subOrders.add(subOrder);
            totalAmount = totalAmount.add(subtotal);
        }

        order.setSubOrders(subOrders);
        order.setTotal(totalAmount);
        order.setStatus(OrderStatus.CONFIRMED);
        orderRepository.save(order);

        // Limpa o carrinho
        cart.getItems().clear();
        cartRepository.save(cart);

        return OrderResponse.from(order);
    }

    public List<OrderResponse> getMyOrders(User user) {
        List<Order> orders = orderRepository.findByBuyerOrderByCreatedAtDesc(user);
        return orders.stream()
                .map(OrderResponse::from)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado"));

        if (!order.getBuyer().getId().equals(user.getId())) {
            throw new IllegalStateException("Você não tem permissão para ver este pedido");
        }

        return OrderResponse.from(order);
    }

    public List<SubOrderResponse> getMySales(User user) {
        // Busca o perfil de vendedor
        SellerProfile seller = sellerRepository.findByUser(user)
                .orElseThrow(() -> new IllegalStateException("Você não tem perfil de vendedor"));

        List<SubOrder> subOrders = subOrderRepository.findBySellerOrderByOrderCreatedAtDesc(seller);
        return subOrders.stream()
                .map(SubOrderResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubOrderResponse updateSubOrderStatus(User user, Long subOrderId, UpdateSubOrderStatusRequest request) {
        SubOrder subOrder = subOrderRepository.findById(subOrderId)
                .orElseThrow(() -> new IllegalArgumentException("Sub-pedido não encontrado"));

        // Valida que o usuário é o vendedor deste sub-pedido
        if (!subOrder.getSeller().getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Você não tem permissão para atualizar este pedido");
        }

        // Atualiza status
        subOrder.setStatus(request.status());

        // Registra no histórico
        SubOrderStatusHistory history = SubOrderStatusHistory.builder()
                .subOrder(subOrder)
                .status(request.status())
                .note(request.note())
                .build();

        subOrder.getStatusHistory().add(history);
        subOrderRepository.save(subOrder);

        return SubOrderResponse.from(subOrder);
    }
}
