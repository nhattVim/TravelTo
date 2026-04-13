package com.nhattVim.TravelTo.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record BookingCreateRequest(
        @NotNull(message = "tourId không được để trống") Long tourId,
        @NotNull(message = "departureId không được để trống") Long departureId,
        @Min(value = 1, message = "Số lượng khách tối thiểu là 1") int guests,
        @NotNull(message = "Tên liên hệ không được để trống") String contactName,
        @NotNull(message = "Số điện thoại không được để trống") String contactPhone,
        String contactNotes) {
}
