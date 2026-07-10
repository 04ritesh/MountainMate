package com.TripService.demo.repository;

import com.TripService.demo.entity.Trip;
import com.TripService.demo.enums.TripStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, String> {
    List<Trip> findByOrganizerUserId(String organizerUserId);
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByTrailId(String trailId);
}