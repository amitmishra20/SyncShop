package com.shopsync.controller;

import com.shopsync.dto.InventoryResponse;
import com.shopsync.model.Inventory;
import com.shopsync.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@PreAuthorize("hasRole('ADMIN')")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryResponse>> getAllInventory() {
        List<InventoryResponse> data = inventoryService.getAllInventory()
                .stream()
                .map(this::mapInventory)
                .toList();

        return ResponseEntity.ok(data);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<InventoryResponse> getInventoryByProduct(@PathVariable Long productId) {
        Inventory inventory = inventoryService.getInventoryByProductId(productId);
        return ResponseEntity.ok(mapInventory(inventory));
    }

    @PutMapping("/product/{productId}/stock")
    public ResponseEntity<InventoryResponse> updateStock(@PathVariable Long productId,
                                                         @RequestParam Integer adjustBy) {
        Inventory updated = inventoryService.updateStock(productId, adjustBy);
        return ResponseEntity.ok(mapInventory(updated));
    }

    @GetMapping("/alerts/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStockAlerts(@RequestParam(defaultValue = "10") Integer threshold) {
        List<InventoryResponse> data = inventoryService.getLowStockAlerts(threshold)
                .stream()
                .map(this::mapInventory)
                .toList();

        return ResponseEntity.ok(data);
    }

    private InventoryResponse mapInventory(Inventory inventory) {
        return new InventoryResponse(
                inventory.getId(),
                inventory.getProduct() != null ? inventory.getProduct().getId() : null,
                inventory.getProduct() != null ? inventory.getProduct().getName() : null,
                inventory.getProduct() != null ? inventory.getProduct().getCategory() : null,
                inventory.getCurrentStock(),
                inventory.getReorderLevel(),
                inventory.getLastRestockDate() != null ? inventory.getLastRestockDate().toString() : null
        );
    }
}