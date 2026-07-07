package com.example.trail_service.dto;

import com.example.trail_service.enums.Difficulty;
import com.example.trail_service.enums.TrailType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TrailRequest {

    @NotBlank(message = "Trail name is required")
    private String name;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private Double elevationGainM;
    private Integer estimatedDurationMinutes;

    @NotNull(message = "Difficulty is required")
    private Difficulty difficulty;

    @NotNull(message = "Trail type is required")
    private TrailType trailType;
}