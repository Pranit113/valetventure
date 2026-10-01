package com.valetventure.service;

import com.valetventure.dto.request.CreateHotelRequest;
import com.valetventure.dto.response.HotelResponse;
import com.valetventure.entity.Hotel;
import com.valetventure.entity.Trip;
import com.valetventure.exception.ResourceNotFoundException;
import com.valetventure.repository.HotelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HotelService {
    private final HotelRepository hotelRepository;
    private final TripService tripService;

    public HotelResponse createHotel(String username, Long tripId, CreateHotelRequest request) {
        Trip trip = tripService.getTripEntity(username, tripId);
        Hotel hotel = Hotel.builder()
                .trip(trip)
                .hotelName(request.getHotelName())
                .location(request.getLocation())
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .pricePerNight(request.getPricePerNight())
                .bookingUrl(request.getBookingUrl())
                .googleMapsUrl(request.getGoogleMapsUrl())
                .notes(request.getNotes())
                .build();
        return mapToResponse(hotelRepository.save(hotel));
    }

    public void deleteHotel(String username, Long id) {
        Hotel hotel = hotelRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        tripService.getTripEntity(username, hotel.getTrip().getId());
        hotelRepository.delete(hotel);
    }

    private HotelResponse mapToResponse(Hotel hotel) {
        return HotelResponse.builder().id(hotel.getId()).hotelName(hotel.getHotelName()).location(hotel.getLocation()).build();
    }
}
