package com.valetventure.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ActivityResponse {
    private Long id;
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
