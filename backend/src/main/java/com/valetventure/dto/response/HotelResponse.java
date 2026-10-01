package com.valetventure.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class HotelResponse {
    private Long id;
    private String hotelName;
    private String location;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private BigDecimal pricePerNight;
    private String bookingUrl;
    private String googleMapsUrl;
    private String notes;
}
