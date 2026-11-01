package com.backend.shopeasy.dto;

import java.util.List;

public class OrderRequest {

    private List<CartItemRequest> items;

    public OrderRequest() {
    }

    public List<CartItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CartItemRequest> items) {
        this.items = items;
    }
}