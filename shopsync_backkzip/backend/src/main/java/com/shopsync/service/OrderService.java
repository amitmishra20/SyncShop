package com.shopsync.service;

import com.shopsync.model.Order;
import com.shopsync.model.OrderItem;
import com.shopsync.model.PaymentMethod;
import com.shopsync.model.OrderStatus;
import java.util.List;

public interface OrderService {
    Order placeOrder(Long userId, String deliveryAddress, List<OrderItem> items, PaymentMethod paymentMethod);
    Order placeOrder(Long userId, com.shopsync.dto.OrderRequest request);
    Order getOrderById(Long id);
    List<Order> getUserOrders(Long userId);
    Order updateOrderStatus(Long orderId, OrderStatus status);
    List<Order> getAllOrders();
}
