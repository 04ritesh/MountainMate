package com.TripService.demo.dto;

import com.TripService.demo.enums.RsvpStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TripMemberResponse {
    private String id;
    private String userId;
    private RsvpStatus rsvpStatus;
    private LocalDateTime joinedAt;
}