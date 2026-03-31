package com.nhattVim.TravelTo.user.dto;

import com.nhattVim.TravelTo.user.entity.UserRole;
import jakarta.validation.constraints.NotNull;

public record UserStatusUpdateRequest(
    @NotNull(message = "Role is required")
    UserRole role
) {}
