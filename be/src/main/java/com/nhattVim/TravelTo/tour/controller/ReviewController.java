package com.nhattVim.TravelTo.tour.controller;

import com.nhattVim.TravelTo.security.JwtService;
import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.tour.dto.ReviewRequest;
import com.nhattVim.TravelTo.tour.dto.ReviewResponse;
import com.nhattVim.TravelTo.tour.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/v1/tours")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtService jwtService;

    @GetMapping("/{tourId}/reviews")
    public ResponseEntity<PagedResponse<ReviewResponse>> getTourReviews(
            @PathVariable Long tourId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getTourReviews(tourId, page, size));
    }

    @PostMapping("/{tourId}/reviews")
    public ResponseEntity<ReviewResponse> createReview(
            @PathVariable Long tourId,
            @Valid @RequestBody ReviewRequest request,
            @RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String email = jwtService.extractEmail(jwt);
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.createReviewByEmail(tourId, email, request));
    }

    @DeleteMapping("/{tourId}/reviews/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable Long tourId,
            @PathVariable Long reviewId,
            @RequestHeader("Authorization") String token) {
        String jwt = token.substring(7);
        String email = jwtService.extractEmail(jwt);
        reviewService.deleteReviewByEmail(reviewId, email);
        return ResponseEntity.noContent().build();
    }
}
