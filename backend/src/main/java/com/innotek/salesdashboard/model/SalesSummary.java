package com.innotek.salesdashboard.model;

import java.time.LocalDateTime;

public class SalesSummary {
    private String id;
    private LocalDateTime uploadTimestamp;
    private int totalRecords;
    private int totalQuantity;
    private double totalRevenue;
    private String fileName;

    public SalesSummary() {}

    public SalesSummary(String id, LocalDateTime uploadTimestamp, int totalRecords, int totalQuantity, double totalRevenue, String fileName) {
        this.id = id;
        this.uploadTimestamp = uploadTimestamp;
        this.totalRecords = totalRecords;
        this.totalQuantity = totalQuantity;
        this.totalRevenue = totalRevenue;
        this.fileName = fileName;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public LocalDateTime getUploadTimestamp() {
        return uploadTimestamp;
    }

    public void setUploadTimestamp(LocalDateTime uploadTimestamp) {
        this.uploadTimestamp = uploadTimestamp;
    }

    public int getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(int totalRecords) {
        this.totalRecords = totalRecords;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public double getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(double totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}