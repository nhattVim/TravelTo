package com.nhattVim.TravelTo.tour.dto;

import com.nhattVim.TravelTo.tour.entity.TourStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public record AdminTourUpsertRequest(
    @NotBlank(message = "provinceCode không được để trống") String provinceCode,
    @NotBlank(message = "provinceName không được để trống") String provinceName,
    @NotBlank(message = "title không được để trống") String title,
    @NotBlank(message = "summary không được để trống") String summary,
    @NotBlank(message = "description không được để trống") String description,
    @NotNull(message = "price không được để trống") @DecimalMin(value = "0.01", message = "price phải lớn hơn 0") BigDecimal price,
    @Min(value = 1, message = "days tối thiểu là 1") int days,
    @Min(value = 0, message = "nights không được âm") int nights,
    String imageUrl,
    List<String> imageUrls,
    @NotBlank(message = "departureLocation không được để trống") String departureLocation,
    @NotBlank(message = "destinationLocation không được để trống") String destinationLocation,
    String attractions,
    String cuisine,
    String suitableFor,
    String idealTime,
    String transport,
    String promotion,
    String notes,
    @NotNull(message = "status không được để trống") TourStatus status) {
}
