package com.nhattVim.TravelTo.tour.repository;

import com.nhattVim.TravelTo.tour.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByTourIdAndParentReviewIsNull(Long tourId, Pageable pageable);
    boolean existsByTourIdAndUserId(Long tourId, Long userId);
}
