package com.innotek.salesdashboard.service;

import com.innotek.salesdashboard.model.SalesRecord;
import com.innotek.salesdashboard.model.SalesSummary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SalesDataService {
    
    // In-memory storage for sales summaries
    private final ConcurrentHashMap<String, SalesSummary> salesSummaries = new ConcurrentHashMap<>();

    public SalesSummary processCsvFile(MultipartFile file) throws IOException {
        List<SalesRecord> records = parseCsvFile(file);
        SalesSummary summary = calculateSummary(records, file.getOriginalFilename());
        
        // Store in memory
        salesSummaries.put(summary.getId(), summary);
        
        return summary;
    }

    public List<SalesSummary> getAllSummaries() {
        return new ArrayList<>(salesSummaries.values());
    }

    public SalesSummary getSummaryById(String id) {
        return salesSummaries.get(id);
    }

    private List<SalesRecord> parseCsvFile(MultipartFile file) throws IOException {
        List<SalesRecord> records = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                // Skip header line
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] fields = line.split(",");
                if (fields.length >= 3) {
                    try {
                        String productName = fields[0].trim();
                        int quantity = Integer.parseInt(fields[1].trim());
                        double pricePerUnit = Double.parseDouble(fields[2].trim());
                        
                        records.add(new SalesRecord(productName, quantity, pricePerUnit));
                    } catch (NumberFormatException e) {
                        // Skip invalid rows
                        System.err.println("Skipping invalid row: " + line);
                    }
                }
            }
        }
        
        return records;
    }

    private SalesSummary calculateSummary(List<SalesRecord> records, String fileName) {
        String id = UUID.randomUUID().toString().substring(0, 8);
        LocalDateTime timestamp = LocalDateTime.now();
        int totalRecords = records.size();
        int totalQuantity = records.stream().mapToInt(SalesRecord::getQuantity).sum();
        double totalRevenue = records.stream().mapToDouble(SalesRecord::getTotalRevenue).sum();
        
        return new SalesSummary(id, timestamp, totalRecords, totalQuantity, totalRevenue, fileName);
    }
}