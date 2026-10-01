package com.valetventure.service;

import com.valetventure.dto.request.CreateActivityRequest;
import com.valetventure.dto.response.ActivityResponse;
import com.valetventure.entity.Activity;
import com.valetventure.entity.TripDay;
import com.valetventure.exception.ResourceNotFoundException;
import com.valetventure.repository.ActivityRepository;
import com.valetventure.repository.TripDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final TripDayRepository tripDayRepository;
    private final TripService tripService;

    public ActivityResponse createActivity(String username, Long dayId, CreateActivityRequest request) {
        TripDay day = tripDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("Day not found"));
        tripService.getTripEntity(username, day.getTrip().getId());

        Activity activity = Activity.builder()
                .tripDay(day)
                .name(request.getName())
                .time(request.getTime())
                .locationName(request.getLocationName())
                .googleMapsUrl(request.getGoogleMapsUrl())
                .description(request.getDescription())
                .durationMinutes(request.getDurationMinutes())
                .estimatedCost(request.getEstimatedCost())
                .bestTime(request.getBestTime())
                .notes(request.getNotes())
                .sortOrder(day.getActivities().size() + 1)
                .build();
        return mapToResponse(activityRepository.save(activity));
    }

    public void deleteActivity(String username, Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found"));
        tripService.getTripEntity(username, activity.getTripDay().getTrip().getId());
        activityRepository.delete(activity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        return ActivityResponse.builder()
                .id(activity.getId())
                .name(activity.getName())
                .time(activity.getTime())
                .locationName(activity.getLocationName())
                .googleMapsUrl(activity.getGoogleMapsUrl())
                .description(activity.getDescription())
                .durationMinutes(activity.getDurationMinutes())
                .estimatedCost(activity.getEstimatedCost())
                .bestTime(activity.getBestTime())
                .notes(activity.getNotes())
                .sortOrder(activity.getSortOrder())
                .build();
    }
}
