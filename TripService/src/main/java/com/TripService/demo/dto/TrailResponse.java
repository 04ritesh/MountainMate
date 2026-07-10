package com.TripService.demo.dto;

import lombok.Data;

@Data
public class TrailResponse {
    private String id;
    private String name;
    private String location;
    private String difficulty;
    private String trailType;
    private Boolean isActive;
}