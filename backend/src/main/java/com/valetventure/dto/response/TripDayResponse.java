package com.valetventure.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class TripDayResponse {
    private Long id;
    private Integer dayNumber;
    private LocalDate date;
    private String location;
    private String notes;
    private List<ActivityResponse> activities;
}
