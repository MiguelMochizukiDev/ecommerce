package com.ecommerce.backend.domain.seller.dto;

import com.ecommerce.backend.domain.seller.PaymentMethod;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.Set;

public record SellerRequest(

    @NotBlank(message = "Nome da loja é obrigatório")
    String storeName,

    String description,

    @NotEmpty(message = "Informe ao menos um método de pagamento")
    Set<PaymentMethod> paymentMethods,

    String pixKey
) {}