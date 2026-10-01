package com.valetventure.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateActivityRequest {
    private String name;
    private String time;
    private String locationName;
    private String googleMapsUrl;
    private String description;
    private Integer durationMinutes;
    private BigDecimal estimatedCost;
    private String bestTime;
    private String notes;
}
