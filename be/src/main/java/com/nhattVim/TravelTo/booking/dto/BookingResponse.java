package com.nhattVim.TravelTo.booking.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public record BookingResponse(
        Long id,
        Long tourId,
        Long departureId,
        String tourTitle,
        String provinceName,
        LocalDate travelDate,
        int guests,
        BigDecimal totalPrice,
        String status,
        Instant createdAt,
        String customerEmail,
        String customerName,
        String contactName,
        String contactPhone,
        String contactNotes) {
}
