package com.nhattVim.TravelTo.tour.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record AdminTourListItemResponse(
    Long id,
    String title,
    String provinceCode,
    String provinceName,
    BigDecimal price,
    String status,
    int days,
    int nights,
    String departureLocation,
    String destinationLocation,
    int slotsTotal,
    int slotsAvailable,
    Instant updatedAt) {
}
