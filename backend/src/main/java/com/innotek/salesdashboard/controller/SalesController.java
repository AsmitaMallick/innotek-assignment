package com.innotek.salesdashboard.controller;

import com.innotek.salesdashboard.model.SalesSummary;
import com.innotek.salesdashboard.service.SalesDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
public class SalesController {

    @Autowired
    private SalesDataService salesDataService;

    @SuppressWarnings("null")
    @PostMapping("/upload-sales-data")
    public ResponseEntity<?> uploadSalesData(@RequestParam("file") MultipartFile file) {
        try {
            // Validate file
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }
            
            if (!file.getOriginalFilename().toLowerCase().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("Only CSV files are allowed");
            }

            // Process file
            SalesSummary summary = salesDataService.processCsvFile(file);
            
            return ResponseEntity.ok(summary);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing file: " + e.getMessage());
        }
    }

    @GetMapping("/sales-summaries")
    public ResponseEntity<List<SalesSummary>> getAllSummaries() {
        List<SalesSummary> summaries = salesDataService.getAllSummaries();
        return ResponseEntity.ok(summaries);
    }

    @GetMapping("/api/sales-summaries/{id}")
    public ResponseEntity<SalesSummary> getSummaryById(@PathVariable String id) {
        SalesSummary summary = salesDataService.getSummaryById(id);
        if (summary != null) {
            return ResponseEntity.ok(summary);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
