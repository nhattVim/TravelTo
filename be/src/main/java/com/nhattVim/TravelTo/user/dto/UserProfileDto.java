package com.nhattVim.TravelTo.user.dto;

import com.nhattVim.TravelTo.user.entity.AuthProvider;
import com.nhattVim.TravelTo.user.entity.UserRole;

public record UserProfileDto(
    Long id,
    String email,
    String fullName,
    String phone,
    String address,
    String avatarUrl,
    AuthProvider provider,
    UserRole role
) {}
