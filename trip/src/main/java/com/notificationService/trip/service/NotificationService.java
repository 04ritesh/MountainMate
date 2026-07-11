package com.notificationService.trip.service;

import com.notificationService.trip.dto.EmailRequest;
import com.notificationService.trip.dto.TrailCreatedEvent;
import com.notificationService.trip.dto.TripBookedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final EmailService emailService;

    public void handleTrailCreated(TrailCreatedEvent event) {
        log.info("Handling trail.created event for trailId: {}", event.getTrailId());

        // In production you would fetch the user's email from Auth Service
        // For now we send to a hardcoded test email via Mailtrap
        String body = String.format("""
                Hello Explorer!
                
                A new trail has been added to SummitBase!
                
                Trail Name  : %s
                Location    : %s
                Difficulty  : %s
                Type        : %s
                
                Log in to SummitBase to explore this trail and plan your next adventure.
                
                Happy Trekking!
                Team SummitBase
                """,
                event.getName(),
                event.getLocation(),
                event.getDifficulty(),
                event.getTrailType()
        );

        emailService.sendEmail(new EmailRequest(
                "test@summitbase.com", // replace with real user email lookup
                "New Trail Added: " + event.getName(),
                body
        ));
    }

    public void handleTripBooked(TripBookedEvent event) {
        log.info("Handling trip.booked event for tripId: {}", event.getTripId());

        String body = String.format("""
                Hello Adventurer!
                
                A new group trip has been created on SummitBase!
                
                Trip Name   : %s
                Trail       : %s
                Start Date  : %s
                End Date    : %s
                
                Log in to SummitBase to join this trip and connect with fellow trekkers.
                
                See you on the trail!
                Team SummitBase
                """,
                event.getTripName(),
                event.getTrailName(),
                event.getStartDate(),
                event.getEndDate()
        );

        emailService.sendEmail(new EmailRequest(
                "test@summitbase.com", // replace with real user email lookup
                "New Trip Created: " + event.getTripName(),
                body
        ));
    }
}