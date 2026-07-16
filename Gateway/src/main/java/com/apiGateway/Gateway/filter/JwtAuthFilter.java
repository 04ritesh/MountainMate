package com.apiGateway.Gateway.filter;

import com.apiGateway.Gateway.security.JwtService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Slf4j
public class JwtAuthFilter extends AbstractGatewayFilterFactory<JwtAuthFilter.Config> {

    @Autowired
    private JwtService jwtService;

    public JwtAuthFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            String path = exchange.getRequest().getPath().toString();
            log.info("Gateway processing request: {}", path);

            // skip JWT check for public GET on trails
            if (isPublicRequest(exchange)) {
                return chain.filter(exchange);
            }

            String authHeader = exchange.getRequest()
                    .getHeaders()
                    .getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.warn("Missing or invalid Authorization header for path: {}", path);
                return unauthorizedResponse(exchange, "Missing Authorization header");
            }

            String token = authHeader.substring(7);

            if (!jwtService.isTokenValid(token)) {
                log.warn("Invalid JWT token for path: {}", path);
                return unauthorizedResponse(exchange, "Invalid or expired token");
            }

            // extract userId and pass as header to downstream service
            String userId = jwtService.extractUserId(token);
            ServerWebExchange modifiedExchange = exchange.mutate()
                    .request(exchange.getRequest().mutate()
                            .header("X-User-Id", userId)
                            .build())
                    .build();

            log.info("JWT valid for userId: {}, forwarding to downstream service", userId);
            return chain.filter(modifiedExchange);
        };
    }

    private boolean isPublicRequest(ServerWebExchange exchange) {
        String method = exchange.getRequest().getMethod().name();
        String path = exchange.getRequest().getPath().toString();

        // allow public GET on trails
        return method.equals("GET") && path.startsWith("/trails");
    }

    private Mono<Void> unauthorizedResponse(ServerWebExchange exchange, String message) {
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        exchange.getResponse().getHeaders().add("Content-Type", "application/json");
        var buffer = exchange.getResponse().bufferFactory()
                .wrap(("{\"error\":\"" + message + "\"}").getBytes());
        return exchange.getResponse().writeWith(Mono.just(buffer));
    }

    public static class Config {
        // config class required by AbstractGatewayFilterFactory
    }
}