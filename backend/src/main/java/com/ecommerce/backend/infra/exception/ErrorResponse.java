package com.ecommerce.backend.infra.exception;

import java.time.LocalDateTime;

/**
 * DTO para respostas de erro padronizadas.
 * Demonstra encapsulamento e design de API REST consistente.
 */
public record ErrorResponse(
    String message,
    int status,
    LocalDateTime timestamp
) {
    public ErrorResponse(String message, int status) {
        this(message, status, LocalDateTime.now());
    }
}
