package com.example.trail_service.kafka;

import com.example.trail_service.dto.TrailCreatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TrailEventProducer {

    private static final String TOPIC = "trail.created";

    private final KafkaTemplate<String, TrailCreatedEvent> kafkaTemplate;

    public void publishTrailCreated(TrailCreatedEvent event) {
        kafkaTemplate.send(TOPIC, event.getTrailId(), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Trail created event published for trailId: {}", event.getTrailId());
                    } else {
                        log.error("Failed to publish trail created event for trailId: {}", event.getTrailId(), ex);
                    }
                });
    }
}