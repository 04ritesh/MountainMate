package com.example.trail_service.dto;

import com.example.trail_service.enums.Difficulty;
import com.example.trail_service.enums.TrailType;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class TrailResponse {
    private String id;
    private String name;
    private String description;
    private String location;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private Double elevationGainM;
    private Integer estimatedDurationMinutes;
    private Difficulty difficulty;
    private TrailType trailType;
    private String createdByUserId;
    private List<String> photoUrls;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}