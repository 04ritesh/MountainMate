package com.example.trail_service.repository;
import com.example.trail_service.entity.Trail;
import com.example.trail_service.enums.Difficulty;
import com.example.trail_service.enums.TrailType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TrailRepository extends JpaRepository<Trail, String> {

    List<Trail> findByCreatedByUserId(String userId);

    List<Trail> findByDifficulty(Difficulty difficulty);

    List<Trail> findByTrailType(TrailType trailType);

    List<Trail> findByIsActiveTrue();

    List<Trail> findByLocationContainingIgnoreCase(String location);

    // find trails within a radius using Haversine formula
    @Query(value = """
            SELECT * FROM trails t
            WHERE (6371 * acos(
                cos(radians(:lat)) * cos(radians(t.latitude)) *
                cos(radians(t.longitude) - radians(:lng)) +
                sin(radians(:lat)) * sin(radians(t.latitude))
            )) < :radiusKm
            """, nativeQuery = true)
    List<Trail> findNearby(@Param("lat") Double lat,
                           @Param("lng") Double lng,
                           @Param("radiusKm") Double radiusKm);
}