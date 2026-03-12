package com.ecommerce.backend.domain.order;

import com.ecommerce.backend.domain.order.dto.CreateOrderRequest;
import com.ecommerce.backend.domain.order.dto.OrderResponse;
import com.ecommerce.backend.domain.order.dto.SubOrderResponse;
import com.ecommerce.backend.domain.order.dto.UpdateSubOrderStatusRequest;
import com.ecommerce.backend.domain.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.createFromCart(user, request));
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getMyOrders(user));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long orderId,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getOrderById(user, orderId));
    }

    @GetMapping("/sales")
    public ResponseEntity<List<SubOrderResponse>> getMySales(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.getMySales(user));
    }

    @PutMapping("/sub-orders/{subOrderId}/status")
    public ResponseEntity<SubOrderResponse> updateSubOrderStatus(
            @PathVariable Long subOrderId,
            @Valid @RequestBody UpdateSubOrderStatusRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(orderService.updateSubOrderStatus(user, subOrderId, request));
    }
}
