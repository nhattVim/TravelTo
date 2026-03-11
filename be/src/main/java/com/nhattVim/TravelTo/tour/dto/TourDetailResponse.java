package com.nhattVim.TravelTo.tour.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record TourDetailResponse(
    Long id,
    String title,
    String summary,
    String description,
    BigDecimal price,
    int days,
    int nights,
    String imageUrl,
    String provinceCode,
    String provinceName,
    int slotsAvailable,
    Instant createdAt) {
}
