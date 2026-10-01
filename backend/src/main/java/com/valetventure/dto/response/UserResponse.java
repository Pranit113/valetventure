package com.valetventure.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String profilePhotoUrl;
    private String instagramUsername;
    private Integer countriesVisited;
    private Integer citiesVisited;
    private String currency;
    private LocalDateTime createdAt;
}
