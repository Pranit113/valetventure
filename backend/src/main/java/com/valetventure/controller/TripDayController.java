package com.valetventure.controller;

import com.valetventure.dto.request.CreateDayRequest;
import com.valetventure.dto.response.TripDayResponse;
import com.valetventure.service.TripDayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TripDayController {

    private final TripDayService tripDayService;

    @PostMapping("/trips/{tripId}/days")
    public ResponseEntity<TripDayResponse> createDay(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tripId,
            @RequestBody CreateDayRequest request) {
        return ResponseEntity.ok(tripDayService.createDay(userDetails.getUsername(), tripId, request));
    }

    @DeleteMapping("/days/{id}")
    public ResponseEntity<Void> deleteDay(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        tripDayService.deleteDay(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
