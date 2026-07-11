package com.notificationService.trip.kafka;

import com.notificationService.trip.dto.TripBookedEvent;
import com.notificationService.trip.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TripEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "trip.booked",
            groupId = "notification-service-group",
            containerFactory = "tripKafkaListenerFactory"
    )
    public void consumeTripBooked(TripBookedEvent event) {
        log.info("Received trip.booked event: {}", event.getTripId());
        try {
            notificationService.handleTripBooked(event);
        } catch (Exception e) {
            log.error("Error processing trip.booked event: {}", e.getMessage());
        }
    }
}