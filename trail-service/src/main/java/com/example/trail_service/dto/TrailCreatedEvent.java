package com.example.trail_service.dto;

import com.example.trail_service.enums.Difficulty;
import com.example.trail_service.enums.TrailType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TrailCreatedEvent {
    private String trailId;
    private String name;
    private String location;
    private Difficulty difficulty;
    private TrailType trailType;
    private String createdByUserId;
}