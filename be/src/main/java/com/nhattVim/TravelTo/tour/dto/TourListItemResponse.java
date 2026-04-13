package com.nhattVim.TravelTo.tour.dto;

import java.math.BigDecimal;

public record TourListItemResponse(
        Long id,
        String title,
        String summary,
        BigDecimal price,
        int days,
        int nights,
        String imageUrl,
        String provinceCode,
        String provinceName,
        String departureLocation,
        String destinationLocation,
        int slotsAvailable,
        java.util.List<String> nextDepartures) {
}
