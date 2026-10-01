package com.valetventure.controller;

import com.valetventure.dto.request.CreateTripRequest;
import com.valetventure.dto.response.TripResponse;
import com.valetventure.dto.response.TripSummaryResponse;
import com.valetventure.service.TripService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @GetMapping
    public ResponseEntity<List<TripSummaryResponse>> getUserTrips(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(tripService.getUserTrips(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<TripResponse> createTrip(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateTripRequest request) {
        return ResponseEntity.ok(tripService.createTrip(userDetails.getUsername(), request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TripResponse> getTrip(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTrip(userDetails.getUsername(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrip(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        tripService.deleteTrip(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
