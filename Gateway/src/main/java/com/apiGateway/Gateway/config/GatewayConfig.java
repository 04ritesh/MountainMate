package com.apiGateway.Gateway.config;

import com.apiGateway.Gateway.filter.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class GatewayConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()

                // Auth Service — no JWT filter
                .route("auth-service", r -> r
                        .path("/auth/**")
                        .uri("http://localhost:8080"))  

                // OAuth2 — no JWT filter
                .route("oauth2-route", r -> r
                        .path("/oauth2/**", "/login/**")
                        .uri("http://localhost:8080"))

                // Trail Service — JWT filter applied
                .route("trail-service", r -> r
                        .path("/trails/**")
                        .filters(f -> f.filter(jwtAuthFilter.apply(new JwtAuthFilter.Config())))
                        .uri("http://localhost:8081"))

                // Trip Service — JWT filter applied
                .route("trip-service", r -> r
                        .path("/trips/**")
                        .filters(f -> f.filter(jwtAuthFilter.apply(new JwtAuthFilter.Config())))
                        .uri("http://localhost:8082"))

                // Notification Service
                .route("notification-service", r -> r
                        .path("/notifications/**")
                        .uri("http://localhost:8083"))

                .build();
    }
}