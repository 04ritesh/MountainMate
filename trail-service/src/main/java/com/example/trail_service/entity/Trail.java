package com.example.trail_service.entity;

import com.example.trail_service.enums.Difficulty;
import com.example.trail_service.enums.TrailType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trails")
@Data
@NoArgsConstructor
public class Trail {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String location;

    private Double latitude;
    private Double longitude;

    private Double distanceKm;
    private Double elevationGainM;
    private Integer estimatedDurationMinutes;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Enumerated(EnumType.STRING)
    private TrailType trailType;

    // userId from auth-service JWT — we don't store a User object,
    // just the ID since User lives in auth-service DB
    @Column(nullable = false)
    private String createdByUserId;

    @ElementCollection
    @CollectionTable(name = "trail_photos", joinColumns = @JoinColumn(name = "trail_id"))
    @Column(name = "photo_url")
    private List<String> photoUrls = new ArrayList<>();

    private Boolean isActive = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}