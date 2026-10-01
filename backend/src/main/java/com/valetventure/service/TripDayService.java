package com.valetventure.service;

import com.valetventure.dto.request.CreateDayRequest;
import com.valetventure.dto.response.TripDayResponse;
import com.valetventure.entity.Trip;
import com.valetventure.entity.TripDay;
import com.valetventure.exception.ResourceNotFoundException;
import com.valetventure.repository.TripDayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TripDayService {

    private final TripDayRepository tripDayRepository;
    private final TripService tripService;

    public TripDayResponse createDay(String username, Long tripId, CreateDayRequest request) {
        Trip trip = tripService.getTripEntity(username, tripId);
        TripDay day = TripDay.builder()
                .trip(trip)
                .dayNumber(trip.getDays().size() + 1)
                .date(request.getDate())
                .location(request.getLocation())
                .notes(request.getNotes())
                .build();
        return mapToResponse(tripDayRepository.save(day));
    }

    public void deleteDay(String username, Long dayId) {
        TripDay day = tripDayRepository.findById(dayId)
                .orElseThrow(() -> new ResourceNotFoundException("Day not found"));
        tripService.getTripEntity(username, day.getTrip().getId()); // ownership check
        tripDayRepository.delete(day);
    }

    private TripDayResponse mapToResponse(TripDay day) {
        return TripDayResponse.builder()
                .id(day.getId())
                .dayNumber(day.getDayNumber())
                .date(day.getDate())
                .location(day.getLocation())
                .notes(day.getNotes())
                .activities(List.of())
                .build();
    }
}
