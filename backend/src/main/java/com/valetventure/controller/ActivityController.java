package com.valetventure.controller;

import com.valetventure.dto.request.CreateActivityRequest;
import com.valetventure.dto.response.ActivityResponse;
import com.valetventure.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @PostMapping("/days/{dayId}/activities")
    public ResponseEntity<ActivityResponse> createActivity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long dayId,
            @RequestBody CreateActivityRequest request) {
        return ResponseEntity.ok(activityService.createActivity(userDetails.getUsername(), dayId, request));
    }

    @DeleteMapping("/activities/{id}")
    public ResponseEntity<Void> deleteActivity(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        activityService.deleteActivity(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
