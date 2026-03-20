package com.nhattVim.TravelTo.tour.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TourDepartureResponse(
    Long id,
    LocalDate departureDate,
    LocalDate returnDate,
    BigDecimal price,
    int slotsTotal,
    int slotsAvailable) {
}
