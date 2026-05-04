package com.nhattVim.TravelTo.tour.dto;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;
import java.util.List;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Integer rating;
    private String comment;
    private Instant createdAt;
    private UserDto user;
    private List<ReviewResponse> replies;

    @Data
    @Builder
    public static class UserDto {
        private Long id;
        private String fullName;
        private String avatarUrl;
    }
}
