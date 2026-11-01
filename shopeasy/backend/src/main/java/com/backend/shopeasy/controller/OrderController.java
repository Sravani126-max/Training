package com.backend.shopeasy.controller;

import com.backend.shopeasy.dto.OrderRequest;
import com.backend.shopeasy.model.Order;
import com.backend.shopeasy.model.OrderStatus;
import com.backend.shopeasy.model.User;
import com.backend.shopeasy.repository.UserRepository;
import com.backend.shopeasy.service.OrderService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserRepository userRepository;

    public OrderController(
            OrderService orderService,
            UserRepository userRepository) {

        this.orderService = orderService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public Order createOrder(
            @RequestBody OrderRequest request,
            Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return orderService.createOrder(user, request);
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(
            Authentication authentication) {

        User user = userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return orderService.getMyOrders(user);
    }

    @GetMapping("/{id}")
    public Order getOrder(
            @PathVariable Long id) {

        return orderService.getById(id);
    }

    @GetMapping("/admin")
    public List<Order> getAllOrders(
            Authentication authentication) {

        return orderService.getAllOrders();
    }

    @PutMapping("/admin/{id}/status")
    public Order updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {

        return orderService.updateOrderStatus(id, status);
    }
}