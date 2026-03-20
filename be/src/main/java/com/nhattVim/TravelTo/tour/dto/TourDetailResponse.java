package com.nhattVim.TravelTo.tour.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public record TourDetailResponse(
        Long id,
        String title,
        String summary,
        String description,
        BigDecimal price,
        int days,
        int nights,
        String imageUrl,
        List<String> imageUrls,
        String provinceCode,
        String provinceName,
        String departureLocation,
        String destinationLocation,
        int slotsAvailable,
        Instant createdAt,
        List<TourDepartureResponse> departures,
        TourAdditionalInfo additionalInfo) {

    public record TourAdditionalInfo(
            String attractions,
            String cuisine,
            String suitableFor,
            String idealTime,
            String transport,
            String promotion,
            String notes) {
    }
}
