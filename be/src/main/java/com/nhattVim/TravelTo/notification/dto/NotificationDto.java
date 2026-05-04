package com.nhattVim.TravelTo.notification.dto;

import lombok.Builder;
import lombok.Data;
import java.time.Instant;

@Data
@Builder
public class NotificationDto {
    private Long id;
    private String message;
    private String relatedUrl;
    private boolean isRead;
    private Instant createdAt;
    private SenderDto sender;

    @Data
    @Builder
    public static class SenderDto {
        private Long id;
        private String fullName;
        private String avatarUrl;
    }
}
