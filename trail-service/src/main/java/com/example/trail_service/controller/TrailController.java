package com.example.trail_service.controller;

import com.example.trail_service.dto.TrailRequest;
import com.example.trail_service.dto.TrailResponse;
import com.example.trail_service.enums.Difficulty;
import com.example.trail_service.enums.TrailType;
import com.example.trail_service.service.TrailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/trails")
@RequiredArgsConstructor
public class TrailController {

    private final TrailService trailService;

    @PostMapping
    public ResponseEntity<TrailResponse> createTrail(@Valid @RequestBody TrailRequest request,
                                                      Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(trailService.createTrail(request, userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrailResponse> getTrail(@PathVariable String id) {
        return ResponseEntity.ok(trailService.getTrailById(id));
    }

    @GetMapping
    public ResponseEntity<List<TrailResponse>> getAllTrails() {
        return ResponseEntity.ok(trailService.getAllTrails());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TrailResponse>> getTrailsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(trailService.getTrailsByUser(userId));
    }

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<TrailResponse>> getByDifficulty(@PathVariable Difficulty difficulty) {
        return ResponseEntity.ok(trailService.getTrailsByDifficulty(difficulty));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<TrailResponse>> getByType(@PathVariable TrailType type) {
        return ResponseEntity.ok(trailService.getTrailsByType(type));
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<TrailResponse>> getNearby(@RequestParam Double lat,
                                                          @RequestParam Double lng,
                                                          @RequestParam(defaultValue = "10") Double radiusKm) {
        return ResponseEntity.ok(trailService.getNearbyTrails(lat, lng, radiusKm));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrailResponse>> search(@RequestParam String location) {
        return ResponseEntity.ok(trailService.searchByLocation(location));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrailResponse> updateTrail(@PathVariable String id,
                                                      @Valid @RequestBody TrailRequest request,
                                                      Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(trailService.updateTrail(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrail(@PathVariable String id, Authentication auth) {
        String userId = (String) auth.getPrincipal();
        trailService.deleteTrail(id, userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/photos")
    public ResponseEntity<TrailResponse> uploadPhoto(@PathVariable String id,
                                                      @RequestParam("file") MultipartFile file,
                                                      Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(trailService.uploadPhoto(id, file, userId));
    }
}