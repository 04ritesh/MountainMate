package com.TripService.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TripRequest {

    @NotBlank(message = "Trip name is required")
    private String name;

    private String description;

    @NotBlank(message = "Trail ID is required")
    private String trailId;

    private LocalDate startDate;
    private LocalDate endDate;
    private String meetingPoint;
    private Integer maxMembers;
}