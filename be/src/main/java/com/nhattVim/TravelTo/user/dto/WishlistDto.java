package com.nhattVim.TravelTo.user.dto;

import java.math.BigDecimal;

public record WishlistDto(
    Long id,
    Long tourId,
    String tourTitle,
    BigDecimal tourPrice,
    String tourImageUrl
) {}
