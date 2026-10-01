package com.valetventure.service;

import com.valetventure.dto.request.UpdateUserRequest;
import com.valetventure.dto.response.UserResponse;
import com.valetventure.entity.User;
import com.valetventure.exception.ResourceNotFoundException;
import com.valetventure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getCurrentUserEntity(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public UserResponse getCurrentUser(String username) {
        return mapToUserResponse(getCurrentUserEntity(username));
    }

    public UserResponse updateCurrentUser(String username, UpdateUserRequest request) {
        User user = getCurrentUserEntity(username);
        
        if (request.getDisplayName() != null) user.setDisplayName(request.getDisplayName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getInstagramUsername() != null) user.setInstagramUsername(request.getInstagramUsername());
        if (request.getProfilePhotoUrl() != null) user.setProfilePhotoUrl(request.getProfilePhotoUrl());
        if (request.getCountriesVisited() != null) user.setCountriesVisited(request.getCountriesVisited());
        if (request.getCitiesVisited() != null) user.setCitiesVisited(request.getCitiesVisited());
        if (request.getCurrency() != null) user.setCurrency(request.getCurrency());
        
        userRepository.save(user);
        return mapToUserResponse(user);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .instagramUsername(user.getInstagramUsername())
                .countriesVisited(user.getCountriesVisited())
                .citiesVisited(user.getCitiesVisited())
                .currency(user.getCurrency())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
