package com.shopsync.service.impl;

import com.shopsync.exception.ResourceNotFoundException;
import com.shopsync.model.Order;
import com.shopsync.model.OrderItem;
import com.shopsync.model.OrderStatus;
import com.shopsync.model.Payment;
import com.shopsync.model.PaymentMethod;
import com.shopsync.model.PaymentStatus;
import com.shopsync.model.Product;
import com.shopsync.model.User;
import com.shopsync.repository.OrderRepository;
import com.shopsync.repository.PaymentRepository;
import com.shopsync.repository.ProductRepository;
import com.shopsync.repository.UserRepository;
import com.shopsync.service.InventoryService;
import com.shopsync.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;
    private final ProductRepository productRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            PaymentRepository paymentRepository,
                            UserRepository userRepository,
                            InventoryService inventoryService,
                            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
        this.inventoryService = inventoryService;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public Order placeOrder(Long userId, String deliveryAddress, List<OrderItem> items, PaymentMethod paymentMethod) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItem item : items) {
            Product product = item.getProduct();

            inventoryService.updateStock(product.getId(), -item.getQuantity());

            BigDecimal lineTotal = item.getPriceAtTimeOfOrder()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));

            total = total.add(lineTotal);
        }

        Order order = new Order(user, total, OrderStatus.PLACED, deliveryAddress);

        for (OrderItem item : items) {
            order.addItem(item);
        }

        order = orderRepository.save(order);

        PaymentStatus initialStatus =
                (paymentMethod == PaymentMethod.COD) ? PaymentStatus.PENDING : PaymentStatus.SUCCESS;

        Payment payment = new Payment(order, total, paymentMethod, initialStatus);

        payment.setTransactionId(
                "TXN-" + System.currentTimeMillis() + "-" +
                user.getId().toString().substring(0, Math.min(4, user.getId().toString().length()))
        );

        paymentRepository.save(payment);

        return order;
    }

    @Override
    @Transactional
    public Order placeOrder(Long userId, com.shopsync.dto.OrderRequest request) {
        List<OrderItem> items = new ArrayList<>();

        for (com.shopsync.dto.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            items.add(new OrderItem(product, itemReq.getQuantity(), product.getPrice()));
        }

        PaymentMethod paymentMethod = PaymentMethod.COD;

        return placeOrder(userId, request.getDeliveryAddress(), items, paymentMethod);
    }

    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        try {
            System.out.println("Updating Order ID: " + orderId + " -> " + status);

            Order order = orderRepository.findById(orderId)
                    .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

            order.setStatus(status);

            Order saved = orderRepository.save(order);

            System.out.println("Order updated successfully");
            return saved;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("FAILED TO UPDATE ORDER STATUS: " + e.getMessage());
        }
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}