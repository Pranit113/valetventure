package com.valetventure.controller;

import com.valetventure.dto.request.CreateRestaurantRequest;
import com.valetventure.dto.response.RestaurantResponse;
import com.valetventure.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RestaurantController {
    private final RestaurantService restaurantService;

    @PostMapping("/trips/{tripId}/restaurants")
    public ResponseEntity<RestaurantResponse> createRestaurant(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tripId,
            @RequestBody CreateRestaurantRequest request) {
        return ResponseEntity.ok(restaurantService.createRestaurant(userDetails.getUsername(), tripId, request));
    }

    @DeleteMapping("/restaurants/{id}")
    public ResponseEntity<Void> deleteRestaurant(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        restaurantService.deleteRestaurant(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
