package com.TripService.demo.repository;

import com.TripService.demo.entity.TripMember;
import com.TripService.demo.enums.RsvpStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TripMemberRepository extends JpaRepository<TripMember, String> {
    List<TripMember> findByTripId(String tripId);
    List<TripMember> findByUserId(String userId);
    Optional<TripMember> findByTripIdAndUserId(String tripId, String userId);
    boolean existsByTripIdAndUserId(String tripId, String userId);
    List<TripMember> findByTripIdAndRsvpStatus(String tripId, RsvpStatus rsvpStatus);
}