package com.shopsync.service;

import com.shopsync.model.Order;
import com.shopsync.repository.InventoryRepository;
import com.shopsync.repository.OrderRepository;
import com.shopsync.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final InventoryRepository inventoryRepository;

    private final ProductRepository productRepository;

    public AnalyticsService(OrderRepository orderRepository, InventoryRepository inventoryRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Aggregations
        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        stats.put("totalOrdersCount", orderRepository.count());
        stats.put("activeCustomers", orderRepository.countActiveCustomers());

        // Weekly Sales Mock/Calc
        stats.put("weeklySalesData", new int[]{4500, 3200, 7800, 5100, 9200, 12500, 8900}); 

        // AI Insights Logic - Real Data Driven
        List<Map<String, String>> insights = generateSmartInsights();
        stats.put("aiInsights", insights);

        return stats;
    }

    private List<Map<String, String>> generateSmartInsights() {
        List<Map<String, String>> insights = new java.util.ArrayList<>();
        long totalOrders = orderRepository.count();
        
        if (totalOrders == 0) {
            Map<String, String> init = new HashMap<>();
            init.put("type", "INFO");
            init.put("title", "Store Initialized");
            init.put("description", "Not enough data for deep insights. Start generating sales!");
            insights.add(init);
        }
        
        // 1. Low Stock Prediction
        var lowStock = inventoryRepository.findByCurrentStockLessThanEqual(15);
        if (!lowStock.isEmpty()) {
            Map<String, String> alert = new HashMap<>();
            alert.put("type", "WARNING");
            alert.put("title", "Low Stock Alert (" + lowStock.size() + " items)");
            alert.put("description", "Products like '" + lowStock.get(0).getProduct().getName() + "' are critically low. Restock to prevent revenue loss.");
            insights.add(alert);
        }

        // 2. Data processing for Top / Slow products
        List<Order> allOrders = orderRepository.findAll();
        Map<Long, Integer> productSales = new HashMap<>();
        
        for (Order order : allOrders) {
            for (com.shopsync.model.OrderItem item : order.getItems()) {
                productSales.put(item.getProduct().getId(), 
                    productSales.getOrDefault(item.getProduct().getId(), 0) + item.getQuantity());
            }
        }

        // Find top seller and slow mover
        Long bestProductId = null;
        int maxSales = -1;
        
        for (Map.Entry<Long, Integer> entry : productSales.entrySet()) {
            if (entry.getValue() > maxSales) {
                maxSales = entry.getValue();
                bestProductId = entry.getKey();
            }
        }

        if (bestProductId != null) {
            final Long bId = bestProductId;
            productRepository.findById(bId).ifPresent(p -> {
                Map<String, String> top = new HashMap<>();
                top.put("type", "SUCCESS");
                top.put("title", "Top Selling Product");
                top.put("description", "'" + p.getName() + "' is your highest velocity item. Ensure stock levels are maintained to maximize profit.");
                insights.add(top);
            });
        }

        // 3. Slow moving products (Products with 0 sales)
        List<com.shopsync.model.Product> allProducts = productRepository.findAll();
        long slowMovers = allProducts.stream().filter(p -> !productSales.containsKey(p.getId())).count();
        
        if (slowMovers > 0) {
            Map<String, String> slow = new HashMap<>();
            slow.put("type", "INFO");
            slow.put("title", "Slow Moving Inventory");
            slow.put("description", slowMovers + " products have zero recent sales. Consider running a discount campaign to clear shelf space.");
            insights.add(slow);
        }

        return insights;
    }
}
