package com.nhattVim.TravelTo.province.dto;

public record ProvinceOverviewResponse(
    Long id,
    String code,
    String name,
    String coverImageUrl,
    long tourCount) {
}
