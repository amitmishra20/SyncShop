package com.shopsync.service;

import com.shopsync.model.Inventory;
import java.util.List;

public interface InventoryService {
    List<Inventory> getAllInventory();
    Inventory getInventoryByProductId(Long productId);
    Inventory updateStock(Long productId, Integer quantityToAddOrRemove);
    List<Inventory> getLowStockAlerts(Integer threshold);
}
