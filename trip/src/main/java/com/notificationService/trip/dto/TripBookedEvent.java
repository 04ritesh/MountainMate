package com.notificationService.trip.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class TripBookedEvent {
    private String tripId;
    private String tripName;
    private String trailId;
    private String trailName;
    private String organizerUserId;
    private LocalDate startDate;
    private LocalDate endDate;
}