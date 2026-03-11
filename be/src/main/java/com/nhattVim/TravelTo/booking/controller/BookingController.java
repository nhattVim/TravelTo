package com.nhattVim.TravelTo.booking.controller;

import com.nhattVim.TravelTo.booking.dto.BookingCreateRequest;
import com.nhattVim.TravelTo.booking.dto.BookingResponse;
import com.nhattVim.TravelTo.booking.dto.BookingStatusUpdateRequest;
import com.nhattVim.TravelTo.booking.service.BookingService;
import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class BookingController {

  private final BookingService bookingService;

  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @PostMapping("/bookings")
  ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingCreateRequest request, Principal principal) {
    return ResponseEntity.ok(bookingService.createBooking(principal.getName(), request));
  }

  @GetMapping("/bookings/me")
  List<BookingResponse> getMyBookings(Principal principal) {
    return bookingService.getMyBookings(principal.getName());
  }

  @GetMapping("/admin/bookings")
  List<BookingResponse> getAllBookings() {
    return bookingService.getAllBookings();
  }

  @PatchMapping("/admin/bookings/{id}/status")
  BookingResponse updateStatus(@PathVariable Long id, @Valid @RequestBody BookingStatusUpdateRequest request) {
    return bookingService.updateStatus(id, request.status());
  }
}
