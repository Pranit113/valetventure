package com.valetventure.dto.request;

import com.valetventure.entity.ExpenseCategory;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreateExpenseRequest {
    private ExpenseCategory category;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    private String notes;
}
