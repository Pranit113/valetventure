package com.valetventure.dto.request;

import lombok.Data;

@Data
public class UpdateUserRequest {
    private String displayName;
    private String bio;
    private String instagramUsername;
    private String profilePhotoUrl;
    private Integer countriesVisited;
    private Integer citiesVisited;
    private String currency;
}
