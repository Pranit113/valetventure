package com.valetventure.service;

import com.valetventure.dto.request.CreateTripRequest;
import com.valetventure.dto.response.*;
import com.valetventure.entity.*;
import com.valetventure.exception.ResourceNotFoundException;
import com.valetventure.exception.UnauthorizedAccessException;
import com.valetventure.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final UserService userService;

    public List<TripSummaryResponse> getUserTrips(String username) {
        User user = userService.getCurrentUserEntity(username);
        return tripRepository.findAllByUserId(user.getId()).stream()
                .map(this::mapToSummary)
                .collect(Collectors.toList());
    }

    public TripResponse createTrip(String username, CreateTripRequest request) {
        User user = userService.getCurrentUserEntity(username);
        Trip trip = Trip.builder()
                .user(user)
                .name(request.getName())
                .destination(request.getDestination())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .numberOfTravelers(request.getNumberOfTravelers())
                .tripType(request.getTripType())
                .travelMode(request.getTravelMode())
                .currency(request.getCurrency())
                .build();
        return mapToResponse(tripRepository.save(trip));
    }

    public TripResponse getTrip(String username, Long tripId) {
        Trip trip = getTripEntity(username, tripId);
        return mapToResponse(trip);
    }

    public Trip getTripEntity(String username, Long tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        if (!trip.getUser().getUsername().equals(username)) {
            throw new UnauthorizedAccessException("You do not own this trip");
        }
        return trip;
    }

    public void deleteTrip(String username, Long tripId) {
        Trip trip = getTripEntity(username, tripId);
        tripRepository.delete(trip);
    }

    private TripSummaryResponse mapToSummary(Trip trip) {
        return TripSummaryResponse.builder()
                .id(trip.getId())
                .name(trip.getName())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .coverImageUrl(trip.getCoverImageUrl())
                .build();
    }

    private TripResponse mapToResponse(Trip trip) {
        return TripResponse.builder()
                .id(trip.getId())
                .name(trip.getName())
                .destination(trip.getDestination())
                .startDate(trip.getStartDate())
                .endDate(trip.getEndDate())
                .numberOfTravelers(trip.getNumberOfTravelers())
                .tripType(trip.getTripType() != null ? trip.getTripType().name() : null)
                .travelMode(trip.getTravelMode() != null ? trip.getTravelMode().name() : null)
                .coverImageUrl(trip.getCoverImageUrl())
                .currency(trip.getCurrency())
                .days(List.of()) // Simplified for brevity
                .hotels(List.of())
                .restaurants(List.of())
                .expenses(List.of())
                .build();
    }
}
