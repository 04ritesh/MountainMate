package com.notificationService.trip.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TrailCreatedEvent {
    private String trailId;
    private String name;
    private String location;
    private String difficulty;
    private String trailType;
    private String createdByUserId;
}