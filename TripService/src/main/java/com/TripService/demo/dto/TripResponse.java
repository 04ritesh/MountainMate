package com.TripService.demo.dto;

import com.TripService.demo.enums.TripStatus;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TripResponse {
    private String id;
    private String name;
    private String description;
    private String trailId;
    private String trailName;
    private String trailLocation;
    private String organizerUserId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String meetingPoint;
    private Integer maxMembers;
    private TripStatus status;
    private List<TripMemberResponse> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}