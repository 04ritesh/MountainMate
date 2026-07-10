package com.TripService.demo.client;

import com.TripService.demo.dto.TrailResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Component
@Slf4j
public class TrailServiceClient {

    private final RestClient restClient;

    public TrailServiceClient(@Value("${trail.service.url}") String trailServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(trailServiceUrl)
                .build();
    }

    public TrailResponse getTrailById(String trailId) {
        try {
            return restClient.get()
                    .uri("/trails/{id}", trailId)
                    .retrieve()
                    .body(TrailResponse.class);
        } catch (RestClientException e) {
            log.error("Failed to fetch trail {} from trail-service: {}", trailId, e.getMessage());
            throw new RuntimeException("Trail not found or Trail Service is unavailable");
        }
    }
}