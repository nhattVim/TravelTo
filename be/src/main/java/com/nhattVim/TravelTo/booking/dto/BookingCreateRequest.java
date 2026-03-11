package com.nhattVim.TravelTo.booking.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record BookingCreateRequest(
    @NotNull(message = "tourId không được để trống") Long tourId,
    @NotNull(message = "travelDate không được để trống") @Future(message = "Ngày khởi hành phải ở tương lai") LocalDate travelDate,
    @Min(value = 1, message = "Số lượng khách tối thiểu là 1") int guests) {
}
