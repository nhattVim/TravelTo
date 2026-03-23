package com.nhattVim.TravelTo.tour.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record AdminTourDepartureUpsertRequest(
    @NotNull(message = "departureDate không được để trống") LocalDate departureDate,
    @NotNull(message = "returnDate không được để trống") LocalDate returnDate,
    @NotNull(message = "price không được để trống") @DecimalMin(value = "0.01", message = "price phải lớn hơn 0") BigDecimal price,
    @Min(value = 1, message = "slotsTotal tối thiểu là 1") int slotsTotal,
    @Min(value = 0, message = "slotsAvailable không được âm") int slotsAvailable) {
}
