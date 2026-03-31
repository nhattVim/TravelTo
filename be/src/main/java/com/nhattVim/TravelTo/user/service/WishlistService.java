package com.nhattVim.TravelTo.user.service;

import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import com.nhattVim.TravelTo.user.dto.WishlistDto;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.entity.Wishlist;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import com.nhattVim.TravelTo.user.repository.WishlistRepository;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WishlistService {

  private final WishlistRepository wishlistRepository;
  private final UserRepository userRepository;
  private final TourRepository tourRepository;

  public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository,
      TourRepository tourRepository) {
    this.wishlistRepository = wishlistRepository;
    this.userRepository = userRepository;
    this.tourRepository = tourRepository;
  }

  public PagedResponse<WishlistDto> getMyWishlist(String email, int page, int size) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    Page<Wishlist> wishlists = wishlistRepository.findByUserId(user.getId(), PageRequest.of(page, size));

    return new PagedResponse<>(
        wishlists.getContent().stream().map(w -> new WishlistDto(w.getId(), w.getTour().getId(),
            w.getTour().getTitle(), w.getTour().getPrice(), w.getTour().getImageUrl())).toList(),
        wishlists.getTotalElements(),
        wishlists.getTotalPages(),
        wishlists.getNumber(),
        wishlists.getSize());
  }

  public void addWishlist(String email, Long tourId) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    Tour tour = tourRepository.findById(tourId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tour not found"));

    if (wishlistRepository.existsByUserIdAndTourId(user.getId(), tour.getId())) {
      return; // Already in wishlist
    }

    wishlistRepository.save(Wishlist.builder().user(user).tour(tour).build());
  }

  public void removeWishlist(String email, Long tourId) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

    wishlistRepository.findByUserIdAndTourId(user.getId(), tourId).ifPresent(wishlistRepository::delete);
  }

  public Map<String, Boolean> checkStatus(String email, Long tourId) {
    User user = userRepository.findByEmailIgnoreCase(email)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    
    return Map.of("isWished", wishlistRepository.existsByUserIdAndTourId(user.getId(), tourId));
  }
}
