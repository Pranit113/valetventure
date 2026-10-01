package com.valetventure.dto.request;

import com.valetventure.entity.TravelMode;
import com.valetventure.entity.TripType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateTripRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String destination;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer numberOfTravelers;
    private TripType tripType;
    private TravelMode travelMode;
    private String currency;
}
