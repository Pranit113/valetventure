package com.valetventure.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestaurantResponse {
    private Long id;
    private String restaurantName;
    private String location;
    private String meal;
    private String priceRange;
    private String googleMapsUrl;
    private String notes;
}
