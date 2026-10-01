package com.valetventure.dto.request;

import lombok.Data;

@Data
public class CreateRestaurantRequest {
    private String restaurantName;
    private String location;
    private String meal;
    private String priceRange;
    private String googleMapsUrl;
    private String notes;
}
