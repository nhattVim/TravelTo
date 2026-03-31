package com.nhattVim.TravelTo.user.repository;

import com.nhattVim.TravelTo.user.entity.Wishlist;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {

  Page<Wishlist> findByUserId(Long userId, Pageable pageable);

  Optional<Wishlist> findByUserIdAndTourId(Long userId, Long tourId);

  boolean existsByUserIdAndTourId(Long userId, Long tourId);
}
