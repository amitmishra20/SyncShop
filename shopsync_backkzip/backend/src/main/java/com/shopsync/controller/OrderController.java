package com.shopsync.controller;

import com.shopsync.dto.OrderItemResponse;
import com.shopsync.dto.OrderResponse;
import com.shopsync.model.Order;
import com.shopsync.model.OrderItem;
import com.shopsync.model.OrderStatus;
import com.shopsync.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @userSecurity.hasUserId(authentication, #userId)")
    public ResponseEntity<List<OrderResponse>> getUserOrders(@PathVariable Long userId) {
        List<OrderResponse> orders = orderService.getUserOrders(userId)
                .stream()
                .map(this::mapOrder)
                .toList();

        return ResponseEntity.ok(orders);
    }

    @PostMapping
    public ResponseEntity<OrderResponse> placeOrder(
            @jakarta.validation.Valid @RequestBody com.shopsync.dto.OrderRequest request,
            org.springframework.security.core.Authentication authentication) {

        com.shopsync.security.UserDetailsImpl userDetails =
                (com.shopsync.security.UserDetailsImpl) authentication.getPrincipal();

        Order order = orderService.placeOrder(userDetails.getId(), request);
        return ResponseEntity.ok(mapOrder(order));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(mapOrder(orderService.getOrderById(id)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        List<OrderResponse> orders = orderService.getAllOrders()
                .stream()
                .map(this::mapOrder)
                .toList();

        return ResponseEntity.ok(orders);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateOrderStatus(@PathVariable Long id,
                                                    @RequestParam String status) {
        OrderStatus orderStatus;

        try {
            orderStatus = OrderStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid status value");
        }

        orderService.updateOrderStatus(id, orderStatus);
        return ResponseEntity.ok("Status updated successfully");
    }

    private OrderResponse mapOrder(Order order) {
        List<OrderItemResponse> items = order.getItems()
                .stream()
                .map(this::mapOrderItem)
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getUser() != null ? order.getUser().getId() : null,
                order.getUser() != null ? order.getUser().getName() : null,
                order.getTotalAmount(),
                order.getStatus(),
                order.getDeliveryAddress(),
                order.getCreatedAt() != null ? order.getCreatedAt().toString() : null,
                items
        );
    }

    private OrderItemResponse mapOrderItem(OrderItem item) {
        return new OrderItemResponse(
                item.getId(),
                item.getProduct() != null ? item.getProduct().getId() : null,
                item.getProduct() != null ? item.getProduct().getName() : null,
                item.getQuantity(),
                item.getPriceAtTimeOfOrder()
        );
    }
}