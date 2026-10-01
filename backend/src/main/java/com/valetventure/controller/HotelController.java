package com.valetventure.controller;

import com.valetventure.dto.request.CreateHotelRequest;
import com.valetventure.dto.response.HotelResponse;
import com.valetventure.service.HotelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class HotelController {
    private final HotelService hotelService;

    @PostMapping("/trips/{tripId}/hotels")
    public ResponseEntity<HotelResponse> createHotel(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tripId,
            @RequestBody CreateHotelRequest request) {
        return ResponseEntity.ok(hotelService.createHotel(userDetails.getUsername(), tripId, request));
    }

    @DeleteMapping("/hotels/{id}")
    public ResponseEntity<Void> deleteHotel(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        hotelService.deleteHotel(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
