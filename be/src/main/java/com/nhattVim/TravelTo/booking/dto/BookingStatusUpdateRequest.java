package com.nhattVim.TravelTo.booking.dto;

import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import jakarta.validation.constraints.NotNull;

public record BookingStatusUpdateRequest(@NotNull(message = "status không được để trống") BookingStatus status) {
}
