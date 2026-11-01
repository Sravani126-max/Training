package com.backend.shopeasy.repository;

import com.backend.shopeasy.model.Order;
import com.backend.shopeasy.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser(User user);
}