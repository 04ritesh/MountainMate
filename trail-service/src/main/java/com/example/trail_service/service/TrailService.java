package com.example.trail_service.service;

import com.example.trail_service.dto.TrailCreatedEvent;
import com.example.trail_service.dto.TrailRequest;
import com.example.trail_service.dto.TrailResponse;
import com.example.trail_service.entity.Trail;
import com.example.trail_service.enums.Difficulty;
import com.example.trail_service.enums.TrailType;
import com.example.trail_service.kafka.TrailEventProducer;
import com.example.trail_service.repository.TrailRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrailService {

    private final TrailRepository trailRepository;
    private final TrailEventProducer trailEventProducer;
    private final MinioService minioService;

    public TrailResponse createTrail(TrailRequest request, String userId) {
        Trail trail = new Trail();
        trail.setName(request.getName());
        trail.setDescription(request.getDescription());
        trail.setLocation(request.getLocation());
        trail.setLatitude(request.getLatitude());
        trail.setLongitude(request.getLongitude());
        trail.setDistanceKm(request.getDistanceKm());
        trail.setElevationGainM(request.getElevationGainM());
        trail.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        trail.setDifficulty(request.getDifficulty());
        trail.setTrailType(request.getTrailType());
        trail.setCreatedByUserId(userId);

        Trail saved = trailRepository.save(trail);

        // publish Kafka event
        trailEventProducer.publishTrailCreated(new TrailCreatedEvent(
                saved.getId(),
                saved.getName(),
                saved.getLocation(),
                saved.getDifficulty(),
                saved.getTrailType(),
                saved.getCreatedByUserId()
        ));

        return mapToResponse(saved);
    }

    public TrailResponse getTrailById(String id) {
        Trail trail = trailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trail not found with id: " + id));
        return mapToResponse(trail);
    }

    public List<TrailResponse> getAllTrails() {
        return trailRepository.findByIsActiveTrue()
                .stream().map(this::mapToResponse).toList();
    }

    public List<TrailResponse> getTrailsByUser(String userId) {
        return trailRepository.findByCreatedByUserId(userId)
                .stream().map(this::mapToResponse).toList();
    }

    public List<TrailResponse> getTrailsByDifficulty(Difficulty difficulty) {
        return trailRepository.findByDifficulty(difficulty)
                .stream().map(this::mapToResponse).toList();
    }

    public List<TrailResponse> getTrailsByType(TrailType type) {
        return trailRepository.findByTrailType(type)
                .stream().map(this::mapToResponse).toList();
    }

    public List<TrailResponse> getNearbyTrails(Double lat, Double lng, Double radiusKm) {
        return trailRepository.findNearby(lat, lng, radiusKm)
                .stream().map(this::mapToResponse).toList();
    }

    public List<TrailResponse> searchByLocation(String location) {
        return trailRepository.findByLocationContainingIgnoreCase(location)
                .stream().map(this::mapToResponse).toList();
    }

    public TrailResponse updateTrail(String id, TrailRequest request, String userId) {
        Trail trail = trailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trail not found with id: " + id));

        if (!trail.getCreatedByUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to update this trail");
        }

        trail.setName(request.getName());
        trail.setDescription(request.getDescription());
        trail.setLocation(request.getLocation());
        trail.setLatitude(request.getLatitude());
        trail.setLongitude(request.getLongitude());
        trail.setDistanceKm(request.getDistanceKm());
        trail.setElevationGainM(request.getElevationGainM());
        trail.setEstimatedDurationMinutes(request.getEstimatedDurationMinutes());
        trail.setDifficulty(request.getDifficulty());
        trail.setTrailType(request.getTrailType());

        return mapToResponse(trailRepository.save(trail));
    }

    public void deleteTrail(String id, String userId) {
        Trail trail = trailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trail not found with id: " + id));

        if (!trail.getCreatedByUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to delete this trail");
        }

        trail.setIsActive(false);
        trailRepository.save(trail); // soft delete
    }

    public TrailResponse uploadPhoto(String id, MultipartFile file, String userId) {
        Trail trail = trailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trail not found with id: " + id));

        if (!trail.getCreatedByUserId().equals(userId)) {
            throw new RuntimeException("You are not authorized to upload photos for this trail");
        }

        String photoUrl = minioService.uploadPhoto(file);
        trail.getPhotoUrls().add(photoUrl);
        return mapToResponse(trailRepository.save(trail));
    }

    private TrailResponse mapToResponse(Trail trail) {
        TrailResponse response = new TrailResponse();
        response.setId(trail.getId());
        response.setName(trail.getName());
        response.setDescription(trail.getDescription());
        response.setLocation(trail.getLocation());
        response.setLatitude(trail.getLatitude());
        response.setLongitude(trail.getLongitude());
        response.setDistanceKm(trail.getDistanceKm());
        response.setElevationGainM(trail.getElevationGainM());
        response.setEstimatedDurationMinutes(trail.getEstimatedDurationMinutes());
        response.setDifficulty(trail.getDifficulty());
        response.setTrailType(trail.getTrailType());
        response.setCreatedByUserId(trail.getCreatedByUserId());
        response.setPhotoUrls(trail.getPhotoUrls());
        response.setIsActive(trail.getIsActive());
        response.setCreatedAt(trail.getCreatedAt());
        response.setUpdatedAt(trail.getUpdatedAt());
        return response;
    }
}