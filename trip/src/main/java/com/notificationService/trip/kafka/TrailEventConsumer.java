package com.notificationService.trip.kafka;

import com.notificationService.trip.dto.TrailCreatedEvent;
import com.notificationService.trip.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TrailEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(
            topics = "trail.created",
            groupId = "notification-service-group",
            containerFactory = "trailKafkaListenerFactory"
    )
    public void consumeTrailCreated(TrailCreatedEvent event) {
        log.info("Received trail.created event: {}", event.getTrailId());
        try {
            notificationService.handleTrailCreated(event);
        } catch (Exception e) {
            log.error("Error processing trail.created event: {}", e.getMessage());
        }
    }
}