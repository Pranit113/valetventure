package com.valetventure.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class ExpenseResponse {
    private Long id;
    private String category;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    private String notes;
}
