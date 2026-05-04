package com.nhattVim.TravelTo.notification.service;

import com.nhattVim.TravelTo.common.exception.NotFoundException;
import com.nhattVim.TravelTo.notification.dto.NotificationDto;
import com.nhattVim.TravelTo.notification.entity.Notification;
import com.nhattVim.TravelTo.notification.repository.NotificationRepository;
import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public PagedResponse<NotificationDto> getUserNotifications(String email, int page, int size) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Page<Notification> notificationPage = notificationRepository.findByRecipientIdOrderByCreatedAtDesc(
                user.getId(), PageRequest.of(page, size));

        return new PagedResponse<>(
                notificationPage.getContent().stream().map(this::mapToDto).toList(),
                notificationPage.getTotalElements(),
                notificationPage.getTotalPages(),
                notificationPage.getNumber(),
                notificationPage.getSize()
        );
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return notificationRepository.countByRecipientIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public void markAsRead(String email, Long id) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Notification not found"));

        if (!notification.getRecipient().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Cannot modify this notification");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationDto mapToDto(Notification notif) {
        NotificationDto.SenderDto senderDto = null;
        if (notif.getSender() != null) {
            senderDto = NotificationDto.SenderDto.builder()
                    .id(notif.getSender().getId())
                    .fullName(notif.getSender().getFullName())
                    .avatarUrl(notif.getSender().getAvatarUrl())
                    .build();
        }

        return NotificationDto.builder()
                .id(notif.getId())
                .message(notif.getMessage())
                .relatedUrl(notif.getRelatedUrl())
                .isRead(notif.isRead())
                .createdAt(notif.getCreatedAt())
                .sender(senderDto)
                .build();
    }
}
