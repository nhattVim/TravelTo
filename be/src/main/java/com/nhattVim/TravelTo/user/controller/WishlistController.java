package com.nhattVim.TravelTo.user.controller;

import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.user.dto.WishlistDto;
import com.nhattVim.TravelTo.user.service.WishlistService;
import java.security.Principal;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/wishlists")
public class WishlistController {

  private final WishlistService wishlistService;

  public WishlistController(WishlistService wishlistService) {
    this.wishlistService = wishlistService;
  }

  @GetMapping
  public ResponseEntity<PagedResponse<WishlistDto>> getMyWishlists(
      Principal principal,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(wishlistService.getMyWishlist(principal.getName(), page, size));
  }

  @GetMapping("/tours/{tourId}/status")
  public ResponseEntity<Map<String, Boolean>> checkStatus(Principal principal, @PathVariable Long tourId) {
    return ResponseEntity.ok(wishlistService.checkStatus(principal.getName(), tourId));
  }

  @PostMapping("/tours/{tourId}")
  public ResponseEntity<Void> addWishlist(Principal principal, @PathVariable Long tourId) {
    wishlistService.addWishlist(principal.getName(), tourId);
    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/tours/{tourId}")
  public ResponseEntity<Void> removeWishlist(Principal principal, @PathVariable Long tourId) {
    wishlistService.removeWishlist(principal.getName(), tourId);
    return ResponseEntity.ok().build();
  }
}
