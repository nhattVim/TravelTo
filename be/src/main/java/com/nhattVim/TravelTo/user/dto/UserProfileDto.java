package com.nhattVim.TravelTo.user.dto;

import com.nhattVim.TravelTo.user.entity.AuthProvider;
import com.nhattVim.TravelTo.user.entity.UserRole;
import java.time.LocalDate;

public record UserProfileDto(
    Long id,
    String email,
    String fullName,
    String phone,
    String address,
    String avatarUrl,
    String gender,
    LocalDate dateOfBirth,
    String identityCard,
    AuthProvider provider,
    UserRole role
) {}
