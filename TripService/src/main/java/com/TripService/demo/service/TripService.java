package com.TripService.demo.service;

import com.TripService.demo.client.TrailServiceClient;
import com.TripService.demo.dto.*;
import com.TripService.demo.entity.Trip;
import com.TripService.demo.entity.TripMember;
import com.TripService.demo.enums.RsvpStatus;
import com.TripService.demo.enums.TripStatus;
import com.TripService.demo.kafka.TripEventProducer;
import com.TripService.demo.repository.TripMemberRepository;
import com.TripService.demo.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TripService {

    private final TripRepository tripRepository;
    private final TripMemberRepository tripMemberRepository;
    private final TrailServiceClient trailServiceClient;
    private final TripEventProducer tripEventProducer;

    @Transactional
    public TripResponse createTrip(TripRequest request, String organizerUserId) {

        // inter-service HTTP call — validate trail exists in trail-service
        TrailResponse trail = trailServiceClient.getTrailById(request.getTrailId());

        if (!trail.getIsActive()) {
            throw new RuntimeException("Trail is not active and cannot be used for a trip");
        }

        Trip trip = new Trip();
        trip.setName(request.getName());
        trip.setDescription(request.getDescription());
        trip.setTrailId(trail.getId());
        trip.setTrailName(trail.getName());
        trip.setTrailLocation(trail.getLocation());
        trip.setOrganizerUserId(organizerUserId);
        trip.setStartDate(request.getStartDate());
        trip.setEndDate(request.getEndDate());
        trip.setMeetingPoint(request.getMeetingPoint());
        trip.setMaxMembers(request.getMaxMembers());
        trip.setStatus(TripStatus.PLANNED);

        Trip saved = tripRepository.save(trip);

        // organizer auto-joins as ACCEPTED member
        TripMember organizer = new TripMember();
        organizer.setTrip(saved);
        organizer.setUserId(organizerUserId);
        organizer.setRsvpStatus(RsvpStatus.ACCEPTED);
        tripMemberRepository.save(organizer);

        // publish Kafka event
        tripEventProducer.publishTripBooked(new TripBookedEvent(
                saved.getId(),
                saved.getName(),
                saved.getTrailId(),
                saved.getTrailName(),
                saved.getOrganizerUserId(),
                saved.getStartDate(),
                saved.getEndDate()
        ));

        return mapToResponse(saved);
    }

    public TripResponse getTripById(String id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + id));
        return mapToResponse(trip);
    }

    public List<TripResponse> getAllTrips() {
        return tripRepository.findAll()
                .stream().map(this::mapToResponse).toList();
    }

    public List<TripResponse> getTripsByOrganizer(String organizerUserId) {
        return tripRepository.findByOrganizerUserId(organizerUserId)
                .stream().map(this::mapToResponse).toList();
    }

    public List<TripResponse> getTripsByTrail(String trailId) {
        return tripRepository.findByTrailId(trailId)
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public TripResponse addMember(String tripId, String userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + tripId));

        if (tripMemberRepository.existsByTripIdAndUserId(tripId, userId)) {
            throw new RuntimeException("User is already a member of this trip");
        }

        if (trip.getMaxMembers() != null &&
                tripMemberRepository.findByTripId(tripId).size() >= trip.getMaxMembers()) {
            throw new RuntimeException("Trip is full");
        }

        TripMember member = new TripMember();
        member.setTrip(trip);
        member.setUserId(userId);
        member.setRsvpStatus(RsvpStatus.PENDING);
        tripMemberRepository.save(member);

        return mapToResponse(trip);
    }

    @Transactional
    public TripResponse updateRsvp(String tripId, String userId, RsvpStatus rsvpStatus) {
        TripMember member = tripMemberRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this trip"));

        member.setRsvpStatus(rsvpStatus);
        tripMemberRepository.save(member);

        return mapToResponse(tripRepository.findById(tripId).get());
    }

    @Transactional
    public TripResponse updateTripStatus(String tripId, TripStatus status, String userId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + tripId));

        if (!trip.getOrganizerUserId().equals(userId)) {
            throw new RuntimeException("Only the organizer can update trip status");
        }

        trip.setStatus(status);
        return mapToResponse(tripRepository.save(trip));
    }

    @Transactional
    public void removeMember(String tripId, String userId, String requestingUserId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new RuntimeException("Trip not found"));

        // only organizer or the member themselves can remove
        if (!trip.getOrganizerUserId().equals(requestingUserId) && !userId.equals(requestingUserId)) {
            throw new RuntimeException("Not authorized to remove this member");
        }

        TripMember member = tripMemberRepository.findByTripIdAndUserId(tripId, userId)
                .orElseThrow(() -> new RuntimeException("Member not found in this trip"));

        tripMemberRepository.delete(member);
    }

    private TripResponse mapToResponse(Trip trip) {
        TripResponse response = new TripResponse();
        response.setId(trip.getId());
        response.setName(trip.getName());
        response.setDescription(trip.getDescription());
        response.setTrailId(trip.getTrailId());
        response.setTrailName(trip.getTrailName());
        response.setTrailLocation(trip.getTrailLocation());
        response.setOrganizerUserId(trip.getOrganizerUserId());
        response.setStartDate(trip.getStartDate());
        response.setEndDate(trip.getEndDate());
        response.setMeetingPoint(trip.getMeetingPoint());
        response.setMaxMembers(trip.getMaxMembers());
        response.setStatus(trip.getStatus());
        response.setCreatedAt(trip.getCreatedAt());
        response.setUpdatedAt(trip.getUpdatedAt());

        List<TripMemberResponse> memberResponses = tripMemberRepository
                .findByTripId(trip.getId())
                .stream()
                .map(m -> {
                    TripMemberResponse mr = new TripMemberResponse();
                    mr.setId(m.getId());
                    mr.setUserId(m.getUserId());
                    mr.setRsvpStatus(m.getRsvpStatus());
                    mr.setJoinedAt(m.getJoinedAt());
                    return mr;
                }).toList();

        response.setMembers(memberResponses);
        return response;
    }
}