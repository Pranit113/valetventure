package com.valetventure.controller;

import com.valetventure.dto.request.CreateExpenseRequest;
import com.valetventure.dto.response.ExpenseResponse;
import com.valetventure.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;

    @PostMapping("/trips/{tripId}/expenses")
    public ResponseEntity<ExpenseResponse> createExpense(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tripId,
            @RequestBody CreateExpenseRequest request) {
        return ResponseEntity.ok(expenseService.createExpense(userDetails.getUsername(), tripId, request));
    }

    @DeleteMapping("/expenses/{id}")
    public ResponseEntity<Void> deleteExpense(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        expenseService.deleteExpense(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
