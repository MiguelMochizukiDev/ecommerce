package com.ecommerce.backend.domain.product;

public enum ProductStatus {
    ACTIVE,    // Disponível para compra
    PAUSED,    // Vendedor pausou temporariamente
    OUT_OF_STOCK, // Estoque zerado (setado automaticamente)
    DELETED    // Soft delete — preserva histórico de pedidos
}