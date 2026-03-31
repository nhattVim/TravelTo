package com.nhattVim.TravelTo.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record UserProfileUpdateRequest(
    @NotBlank(message = "Full name cannot be blank")
    @Size(max = 120, message = "Full name must be at most 120 characters")
    String fullName,
    
    @Size(max = 20, message = "Phone must be at most 20 characters")
    String phone,
    
    @Size(max = 255, message = "Address must be at most 255 characters")
    String address,
    
    @Size(max = 400, message = "Avatar URL must be at most 400 characters")
    String avatarUrl,

    @Size(max = 10, message = "Gender must be at most 10 characters")
    String gender,

    LocalDate dateOfBirth,

    @Size(max = 20, message = "Identity card must be at most 20 characters")
    String identityCard
) {}
