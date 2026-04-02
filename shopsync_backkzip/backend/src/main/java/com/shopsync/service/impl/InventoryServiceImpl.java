package com.shopsync.service.impl;

import com.shopsync.exception.ResourceNotFoundException;
import com.shopsync.model.Inventory;
import com.shopsync.repository.InventoryRepository;
import com.shopsync.service.InventoryService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;

    public InventoryServiceImpl(InventoryRepository inventoryRepository) {
        this.inventoryRepository = inventoryRepository;
    }

    @Override
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory getInventoryByProductId(Long productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory details not found for product id: " + productId));
    }

    @Override
    @Transactional
    public Inventory updateStock(Long productId, Integer quantityToAddOrRemove) {
        Inventory inventory = getInventoryByProductId(productId);
        int newStock = inventory.getCurrentStock() + quantityToAddOrRemove;
        
        if (newStock < 0) {
            throw new IllegalArgumentException("Insufficient stock. Current stock is " + inventory.getCurrentStock());
        }
        
        inventory.setCurrentStock(newStock);
        if (quantityToAddOrRemove > 0) {
            inventory.setLastRestockDate(LocalDateTime.now());
        }
        
        return inventoryRepository.save(inventory);
    }

    @Override
    public List<Inventory> getLowStockAlerts(Integer threshold) {
        return inventoryRepository.findByCurrentStockLessThanEqual(threshold);
    }
}
