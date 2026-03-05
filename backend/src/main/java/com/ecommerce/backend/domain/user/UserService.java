package com.ecommerce.backend.domain.user;

import com.ecommerce.backend.domain.user.dto.RegisterRequest;
import com.ecommerce.backend.domain.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Email já cadastrado: " + request.email());
        }

        if (request.cpf() != null && userRepository.existsByCpf(request.cpf())) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .cpf(request.cpf())
                .phone(request.phone())
                .build();

        User saved = userRepository.save(user);
        return UserResponse.from(saved);
    }
}