package com.ecommerce.backend.domain.user.dto;

import com.ecommerce.backend.domain.user.Role;
import com.ecommerce.backend.domain.user.User;

import java.time.LocalDateTime;
import java.util.Set;

public record UserResponse(
    Long id,
    String name,
    String email,
    String cpf,
    String phone,
    Set<Role> roles,
    boolean active,
    LocalDateTime createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCpf(),
            user.getPhone(),
            user.getRoles(),
            user.isActive(),
            user.getCreatedAt()
        );
    }
}