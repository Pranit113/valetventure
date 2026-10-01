package com.valetventure.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TripResponse {
    private Long id;
    private String name;
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfTravelers;
    private String tripType;
    private String travelMode;
    private String coverImageUrl;
    private String currency;
    private List<TripDayResponse> days;
    private List<HotelResponse> hotels;
    private List<RestaurantResponse> restaurants;
    private List<ExpenseResponse> expenses;
}
