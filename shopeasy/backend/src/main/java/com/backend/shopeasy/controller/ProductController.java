package com.backend.shopeasy.controller;

import com.backend.shopeasy.model.Product;
import com.backend.shopeasy.service.ProductService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
public List<Product> all(
        @RequestParam(required = false) String keyword) {

    if (keyword == null || keyword.isBlank()) {
        return service.getAll();
    }

    return service.search(keyword);
}

    @GetMapping("/{id}")
    public Product one(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
public Product create(@Valid @RequestBody Product product) {
    return service.create(product);
}
    @PutMapping("/{id}")
public Product update(@PathVariable Long id, @RequestBody Product product) {
    return service.update(id, product);
}
@DeleteMapping("/{id}")
public void delete(@PathVariable Long id) {
    service.delete(id);
}
}