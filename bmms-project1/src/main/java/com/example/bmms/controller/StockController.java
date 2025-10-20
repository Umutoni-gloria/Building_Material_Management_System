package com.example.bmms.controller;

import com.example.bmms.model.Stock;
import com.example.bmms.service.StockService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockService.getAllStocks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Stock> getStockById(@PathVariable Long id) {
        return stockService.getStockById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Stock createStock(@RequestBody Stock stock) {
        return stockService.saveStock(stock);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable Long id, @RequestBody Stock stockDetails) {
        return stockService.getStockById(id)
                .map(stock -> {
                    stock.setProduct(stockDetails.getProduct());
                    stock.setSupplier(stockDetails.getSupplier());
                    stock.setQuantity(stockDetails.getQuantity());
                    stock.setPurchaseDate(stockDetails.getPurchaseDate());
                    return ResponseEntity.ok(stockService.saveStock(stock));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        return stockService.getStockById(id)
                .map(stock -> {
                    stockService.deleteStock(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

