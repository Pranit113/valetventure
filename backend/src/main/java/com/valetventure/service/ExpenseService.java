package com.valetventure.service;

import com.valetventure.dto.request.CreateExpenseRequest;
import com.valetventure.dto.response.ExpenseResponse;
import com.valetventure.entity.Expense;
import com.valetventure.entity.Trip;
import com.valetventure.exception.ResourceNotFoundException;
import com.valetventure.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final TripService tripService;

    public ExpenseResponse createExpense(String username, Long tripId, CreateExpenseRequest request) {
        Trip trip = tripService.getTripEntity(username, tripId);
        Expense expense = Expense.builder()
                .trip(trip)
                .category(request.getCategory())
                .description(request.getDescription())
                .amount(request.getAmount())
                .date(request.getDate())
                .notes(request.getNotes())
                .build();
        return mapToResponse(expenseRepository.save(expense));
    }

    public void deleteExpense(String username, Long id) {
        Expense expense = expenseRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Expense not found"));
        tripService.getTripEntity(username, expense.getTrip().getId());
        expenseRepository.delete(expense);
    }

    private ExpenseResponse mapToResponse(Expense exp) {
        return ExpenseResponse.builder().id(exp.getId()).description(exp.getDescription()).build();
    }
}
