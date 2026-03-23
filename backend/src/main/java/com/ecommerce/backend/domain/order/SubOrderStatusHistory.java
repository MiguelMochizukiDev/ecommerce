package com.ecommerce.backend.domain.order;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "sub_order_status_history")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubOrderStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sub_order_id", nullable = false)
    private SubOrder subOrder;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubOrderStatus status;

    @Column(nullable = false)
    private LocalDateTime changedAt;

    private String note;

    @PrePersist
    public void prePersist() {
        this.changedAt = LocalDateTime.now();
    }
}
