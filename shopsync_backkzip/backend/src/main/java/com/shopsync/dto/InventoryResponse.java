package com.shopsync.dto;

public class InventoryResponse {

    private Long id;
    private Long productId;
    private String productName;
    private String category;
    private Integer currentStock;
    private Integer reorderLevel;
    private String lastRestockDate;

    public InventoryResponse() {
    }

    public InventoryResponse(Long id, Long productId, String productName, String category,
                             Integer currentStock, Integer reorderLevel, String lastRestockDate) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.category = category;
        this.currentStock = currentStock;
        this.reorderLevel = reorderLevel;
        this.lastRestockDate = lastRestockDate;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getCurrentStock() { return currentStock; }
    public void setCurrentStock(Integer currentStock) { this.currentStock = currentStock; }

    public Integer getReorderLevel() { return reorderLevel; }
    public void setReorderLevel(Integer reorderLevel) { this.reorderLevel = reorderLevel; }

    public String getLastRestockDate() { return lastRestockDate; }
    public void setLastRestockDate(String lastRestockDate) { this.lastRestockDate = lastRestockDate; }
}