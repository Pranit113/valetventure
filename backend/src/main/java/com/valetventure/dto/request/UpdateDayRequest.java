package com.valetventure.dto.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateDayRequest {
    private LocalDate date;
    private String location;
    private String notes;
}
