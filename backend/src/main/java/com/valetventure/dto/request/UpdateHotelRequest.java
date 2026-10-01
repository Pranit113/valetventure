package com.valetventure.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateHotelRequest {
    private String hotelName;
    private String location;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private BigDecimal pricePerNight;
    private String bookingUrl;
    private String googleMapsUrl;
    private String notes;
}
