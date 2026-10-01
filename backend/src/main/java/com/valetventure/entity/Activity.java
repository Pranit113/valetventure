package com.valetventure.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "activities")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_day_id", nullable = false)
    private TripDay tripDay;

    @Column(nullable = false)
    private String name;

    private String time;
    private String locationName;
    private String googleMapsUrl;
    private String description;
    private Integer durationMinutes;
    private BigDecimal estimatedCost;
    private String bestTime;
    private String notes;
    private Integer sortOrder;
}
