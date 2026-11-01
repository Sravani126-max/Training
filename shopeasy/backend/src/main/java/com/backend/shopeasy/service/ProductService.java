package com.backend.shopeasy.service;

import com.backend.shopeasy.model.Product;
import com.backend.shopeasy.repository.ProductRepository;
import org.springframework.stereotype.Service;
import com.backend.shopeasy.exception.ResourceNotFoundException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<Product> getAll() {
        return repo.findAll();
    }
    public List<Product> search(String keyword) {
    return repo.findByNameContainingIgnoreCase(keyword);
}

    public Product getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product " + id + " not found"));
    }

    public Product create(Product product) {
        return repo.save(product);
    }
    public Product update(Long id, Product product) {
    Product existing = getById(id);

    existing.setName(product.getName());
    existing.setDescription(product.getDescription());
    existing.setPrice(product.getPrice());
    existing.setStock(product.getStock());
    existing.setImageUrl(product.getImageUrl());

    return repo.save(existing);
}
public void delete(Long id) {
    Product existing = getById(id);
    repo.delete(existing);
}
}