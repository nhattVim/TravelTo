package com.nhattVim.TravelTo.tour.service;

import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import com.nhattVim.TravelTo.booking.repository.BookingRepository;
import com.nhattVim.TravelTo.common.exception.BadRequestException;
import com.nhattVim.TravelTo.common.exception.NotFoundException;
import com.nhattVim.TravelTo.notification.entity.Notification;
import com.nhattVim.TravelTo.notification.repository.NotificationRepository;
import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.tour.dto.ReviewRequest;
import com.nhattVim.TravelTo.tour.dto.ReviewResponse;
import com.nhattVim.TravelTo.tour.entity.Review;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.repository.ReviewRepository;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final TourRepository tourRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final NotificationRepository notificationRepository;

    @Transactional(readOnly = true)
    public PagedResponse<ReviewResponse> getTourReviews(Long tourId, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Review> reviewPage = reviewRepository.findByTourIdAndParentReviewIsNull(tourId, pageRequest);

        return new PagedResponse<>(
                reviewPage.getContent().stream().map(this::mapToResponse).toList(),
                reviewPage.getTotalElements(),
                reviewPage.getTotalPages(),
                reviewPage.getNumber(),
                reviewPage.getSize()
        );
    }

    @Transactional
    public ReviewResponse createReviewByEmail(Long tourId, String email, ReviewRequest request) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return createReview(tourId, user.getId(), request);
    }

    @Transactional
    public ReviewResponse createReview(Long tourId, Long userId, ReviewRequest request) {
        Tour tour = tourRepository.findById(tourId)
                .orElseThrow(() -> new NotFoundException("Tour not found with id: " + tourId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Review parentReview = null;
        if (request.getParentId() != null) {
            parentReview = reviewRepository.findById(request.getParentId())
                    .orElseThrow(() -> new NotFoundException("Parent review not found"));
        }

        if (parentReview == null) {
            // Root comment. If rating is provided, check booking.
            if (request.getRating() != null) {
                boolean hasBooking = bookingRepository.existsByTourIdAndUserIdAndStatus(tourId, userId, BookingStatus.COMPLETED) 
                        || bookingRepository.existsByTourIdAndUserIdAndStatus(tourId, userId, BookingStatus.CONFIRMED)
                        || bookingRepository.existsByTourIdAndUserIdAndStatus(tourId, userId, BookingStatus.PENDING); 
                
                if (!hasBooking) {
                    throw new BadRequestException("Bạn cần phải đặt tour này mới có thể đánh giá chấm điểm. Nếu chỉ muốn bình luận/hỏi đáp, vui lòng bỏ đánh giá sao.");
                }
            }
        }

        Review review = Review.builder()
                .tour(tour)
                .user(user)
                .rating(request.getRating())
                .comment(request.getComment())
                .parentReview(parentReview)
                .build();

        Review savedReview = reviewRepository.save(review);

        // Notify parent author
        if (parentReview != null && !parentReview.getUser().getId().equals(user.getId())) {
            String msg = String.format("%s đã trả lời bình luận của bạn tại tour %s.", user.getFullName(), tour.getTitle());
            Notification notif = Notification.builder()
                    .recipient(parentReview.getUser())
                    .sender(user)
                    .message(msg)
                    .relatedUrl("/tours/" + tourId)
                    .isRead(false)
                    .build();
            notificationRepository.save(notif);
        }

        return mapToResponse(savedReview);
    }

    private ReviewResponse mapToResponse(Review review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .user(ReviewResponse.UserDto.builder()
                        .id(review.getUser().getId())
                        .fullName(review.getUser().getFullName())
                        .avatarUrl(review.getUser().getAvatarUrl())
                        .build())
                .replies(review.getReplies() != null ? review.getReplies().stream().map(this::mapToResponse).collect(Collectors.toList()) : null)
                .build();
    }

    @Transactional
    public void deleteReviewByEmail(Long reviewId, String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new NotFoundException("Review not found"));
                
        if (!review.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Bạn không có quyền xóa bình luận này");
        }
        
        reviewRepository.delete(review);
    }
}
