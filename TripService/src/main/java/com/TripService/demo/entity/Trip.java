package com.TripService.demo.entity;

import com.TripService.demo.enums.TripStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trips")
@Data
@NoArgsConstructor
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    // trail id from trail-service — no FK since different DB
    @Column(nullable = false)
    private String trailId;

    private String trailName;
    private String trailLocation;

    // organizer userId from JWT
    @Column(nullable = false)
    private String organizerUserId;

    private LocalDate startDate;
    private LocalDate endDate;
    private String meetingPoint;
    private Integer maxMembers;

    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.PLANNED;

    @OneToMany(mappedBy = "trip", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TripMember> members = new ArrayList<>();

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}