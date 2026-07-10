package com.TripService.demo.controller;

import com.TripService.demo.dto.TripRequest;
import com.TripService.demo.dto.TripResponse;
import com.TripService.demo.enums.RsvpStatus;
import com.TripService.demo.enums.TripStatus;
import com.TripService.demo.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(@Valid @RequestBody TripRequest request,
                                                    Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tripService.createTrip(request, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTrip(@PathVariable String id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @GetMapping
    public ResponseEntity<List<TripResponse>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/my")
    public ResponseEntity<List<TripResponse>> getMyTrips(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(tripService.getTripsByOrganizer(userId));
    }

    @GetMapping("/trail/{trailId}")
    public ResponseEntity<List<TripResponse>> getTripsByTrail(@PathVariable String trailId) {
        return ResponseEntity.ok(tripService.getTripsByTrail(trailId));
    }

    @PostMapping("/{tripId}/members")
    public ResponseEntity<TripResponse> joinTrip(@PathVariable String tripId,
                                                  Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(tripService.addMember(tripId, userId));
    }

    @PatchMapping("/{tripId}/rsvp")
    public ResponseEntity<TripResponse> updateRsvp(@PathVariable String tripId,
                                                    @RequestParam RsvpStatus status,
                                                    Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(tripService.updateRsvp(tripId, userId, status));
    }

    @PatchMapping("/{tripId}/status")
    public ResponseEntity<TripResponse> updateTripStatus(@PathVariable String tripId,
                                                          @RequestParam TripStatus status,
                                                          Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(tripService.updateTripStatus(tripId, status, userId));
    }

    @DeleteMapping("/{tripId}/members/{userId}")
    public ResponseEntity<?> removeMember(@PathVariable String tripId,
                                           @PathVariable String userId,
                                           Authentication auth) {
        String requestingUserId = (String) auth.getPrincipal();
        tripService.removeMember(tripId, userId, requestingUserId);
        return ResponseEntity.ok().build();
    }
}