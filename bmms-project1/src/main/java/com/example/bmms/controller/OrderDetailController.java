package com.example.bmms.controller;

import com.example.bmms.model.OrderDetail;
import com.example.bmms.service.OrderDetailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orderdetails")
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    @GetMapping
    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailService.getAllOrderDetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetail> getOrderDetailById(@PathVariable Long id) {
        return orderDetailService.getOrderDetailById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderDetail createOrderDetail(@RequestBody OrderDetail orderDetail) {
        return orderDetailService.saveOrderDetail(orderDetail);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDetail> updateOrderDetail(@PathVariable Long id, @RequestBody OrderDetail orderDetailDetails) {
        return orderDetailService.getOrderDetailById(id)
                .map(orderDetail -> {
                    orderDetail.setOrder(orderDetailDetails.getOrder());
                    orderDetail.setProduct(orderDetailDetails.getProduct());
                    orderDetail.setQuantity(orderDetailDetails.getQuantity());
                    orderDetail.setSubtotal(orderDetailDetails.getSubtotal());
                    return ResponseEntity.ok(orderDetailService.saveOrderDetail(orderDetail));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        return orderDetailService.getOrderDetailById(id)
                .map(orderDetail -> {
                    orderDetailService.deleteOrderDetail(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

