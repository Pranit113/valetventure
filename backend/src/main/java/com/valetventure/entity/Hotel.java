package com.valetventure.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "hotels")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id", nullable = false)
    private Trip trip;

    private String hotelName;
    private String location;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private BigDecimal pricePerNight;
    private String bookingUrl;
    private String googleMapsUrl;
    private String notes;
}
