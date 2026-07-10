package com.TripService.demo.entity;

import com.TripService.demo.enums.RsvpStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "trip_members")
@Data
@NoArgsConstructor
public class TripMember {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    @Column(nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    private RsvpStatus rsvpStatus = RsvpStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime joinedAt;
}