package com.innotek.salesdashboard.model;

public class SalesRecord {
    private String productName;
    private int quantity;
    private double pricePerUnit;

    public SalesRecord() {}

    public SalesRecord(String productName, int quantity, double pricePerUnit) {
        this.productName = productName;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
    }

    // Getters and Setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(double pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public double getTotalRevenue() {
        return quantity * pricePerUnit;
    }
}
