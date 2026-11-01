package com.backend.shopeasy.service;

import com.backend.shopeasy.dto.CartItemRequest;
import com.backend.shopeasy.dto.OrderRequest;
import com.backend.shopeasy.exception.ResourceNotFoundException;
import com.backend.shopeasy.model.Order;
import com.backend.shopeasy.model.OrderItem;
import com.backend.shopeasy.model.OrderStatus;
import com.backend.shopeasy.model.Product;
import com.backend.shopeasy.model.User;
import com.backend.shopeasy.repository.OrderItemRepository;
import com.backend.shopeasy.repository.OrderRepository;
import com.backend.shopeasy.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
    }

    // Create Order
    public Order createOrder(User user, OrderRequest request) {

        BigDecimal totalAmount = BigDecimal.ZERO;

        Order order = new Order();

        order.setUser(user);
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        order = orderRepository.save(order);

        for (CartItemRequest itemRequest : request.getItems()) {

            // Find product
            Product product = productRepository
                    .findById(itemRequest.getProductId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Product " + itemRequest.getProductId() + " not found"
                            ));

            // Validate quantity
            if (itemRequest.getQuantity() <= 0) {

                throw new IllegalArgumentException(
                        "Quantity must be greater than 0"
                );
            }

            // Check stock
            if (itemRequest.getQuantity() > product.getStock()) {

                throw new IllegalArgumentException(
                        "Not enough stock for product: "
                                + product.getName()
                );
            }

            // Calculate item total
            BigDecimal itemTotal = product.getPrice()
                    .multiply(
                            BigDecimal.valueOf(
                                    itemRequest.getQuantity()
                            )
                    );

            totalAmount = totalAmount.add(itemTotal);

            // Create OrderItem
            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(product.getPrice());

            orderItemRepository.save(orderItem);

            // Decrease product stock
            product.setStock(
                    product.getStock()
                            - itemRequest.getQuantity()
            );

            productRepository.save(product);
        }

        // Set final order total
        order.setTotalAmount(totalAmount);

        return orderRepository.save(order);
    }

    // Get logged-in user's orders
    // Get logged-in user's orders
public List<Order> getMyOrders(User user) {
    return orderRepository.findByUser(user);
}

// Get all orders - Admin


// Get order by ID
// Get all orders - Admin
public List<Order> getAllOrders() {
    return orderRepository.findAll();
}

// Update order status - Admin
public Order updateOrderStatus(Long id, OrderStatus status) {

    Order order = orderRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Order " + id + " not found"
                    ));

    OrderStatus currentStatus = order.getStatus();

    if (currentStatus == OrderStatus.PLACED
            && status != OrderStatus.CONFIRMED
            && status != OrderStatus.CANCELLED) {

        throw new IllegalArgumentException(
                "PLACED order can only be CONFIRMED or CANCELLED"
        );
    }

    if (currentStatus == OrderStatus.CONFIRMED
            && status != OrderStatus.SHIPPED
            && status != OrderStatus.CANCELLED) {

        throw new IllegalArgumentException(
                "CONFIRMED order can only be SHIPPED or CANCELLED"
        );
    }

    if (currentStatus == OrderStatus.SHIPPED
            && status != OrderStatus.DELIVERED) {

        throw new IllegalArgumentException(
                "SHIPPED order can only be DELIVERED"
        );
    }

    if (currentStatus == OrderStatus.DELIVERED
            || currentStatus == OrderStatus.CANCELLED) {

        throw new IllegalArgumentException(
                "This order can no longer be updated"
        );
    }

    order.setStatus(status);

    return orderRepository.save(order);
}

// Get order by ID
public Order getById(Long id) {
    return orderRepository.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException(
                            "Order " + id + " not found"
                    ));
}
}