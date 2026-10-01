package com.valetventure.service;

import com.valetventure.dto.request.CreateRestaurantRequest;
import com.valetventure.dto.response.RestaurantResponse;
import com.valetventure.entity.Restaurant;
import com.valetventure.entity.Trip;
import com.valetventure.exception.ResourceNotFoundException;
import com.valetventure.repository.RestaurantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RestaurantService {
    private final RestaurantRepository restaurantRepository;
    private final TripService tripService;

    public RestaurantResponse createRestaurant(String username, Long tripId, CreateRestaurantRequest request) {
        Trip trip = tripService.getTripEntity(username, tripId);
        Restaurant restaurant = Restaurant.builder()
                .trip(trip)
                .restaurantName(request.getRestaurantName())
                .location(request.getLocation())
                .meal(request.getMeal())
                .priceRange(request.getPriceRange())
                .googleMapsUrl(request.getGoogleMapsUrl())
                .notes(request.getNotes())
                .build();
        return mapToResponse(restaurantRepository.save(restaurant));
    }

    public void deleteRestaurant(String username, Long id) {
        Restaurant restaurant = restaurantRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        tripService.getTripEntity(username, restaurant.getTrip().getId());
        restaurantRepository.delete(restaurant);
    }

    private RestaurantResponse mapToResponse(Restaurant res) {
        return RestaurantResponse.builder().id(res.getId()).restaurantName(res.getRestaurantName()).location(res.getLocation()).build();
    }
}
