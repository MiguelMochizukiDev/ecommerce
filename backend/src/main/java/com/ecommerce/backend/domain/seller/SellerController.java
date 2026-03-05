package com.ecommerce.backend.domain.seller;

import com.ecommerce.backend.domain.seller.dto.SellerRequest;
import com.ecommerce.backend.domain.seller.dto.SellerResponse;
import com.ecommerce.backend.domain.user.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final SellerService sellerService;

    @PostMapping("/activate")
    public ResponseEntity<SellerResponse> activate(
            @Valid @RequestBody SellerRequest request,
            Authentication authentication) {

        User currentUser = (User) authentication.getPrincipal();
        SellerResponse response = sellerService.activateSellerProfile(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<SellerResponse> myProfile(Authentication authentication) {
        User currentUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(sellerService.getMySellerProfile(currentUser));
    }
}