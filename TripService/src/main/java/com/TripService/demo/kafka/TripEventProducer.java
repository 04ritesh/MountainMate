package com.TripService.demo.kafka;

import com.TripService.demo.dto.TripBookedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TripEventProducer {

    private static final String TOPIC = "trip.booked";

    private final KafkaTemplate<String, TripBookedEvent> kafkaTemplate;

    public void publishTripBooked(TripBookedEvent event) {
        kafkaTemplate.send(TOPIC, event.getTripId(), event)
                .whenComplete((result, ex) -> {
                    if (ex == null) {
                        log.info("Trip booked event published for tripId: {}", event.getTripId());
                    } else {
                        log.error("Failed to publish trip booked event for tripId: {}", event.getTripId(), ex);
                    }
                });
    }
}