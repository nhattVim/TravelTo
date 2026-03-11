package com.nhattVim.TravelTo.booking.service;

import com.nhattVim.TravelTo.booking.dto.BookingCreateRequest;
import com.nhattVim.TravelTo.booking.dto.BookingResponse;
import com.nhattVim.TravelTo.booking.entity.Booking;
import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import com.nhattVim.TravelTo.booking.repository.BookingRepository;
import com.nhattVim.TravelTo.common.exception.BadRequestException;
import com.nhattVim.TravelTo.common.exception.NotFoundException;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

  private final BookingRepository bookingRepository;
  private final TourRepository tourRepository;
  private final UserRepository userRepository;

  public BookingService(BookingRepository bookingRepository, TourRepository tourRepository,
      UserRepository userRepository) {
    this.bookingRepository = bookingRepository;
    this.tourRepository = tourRepository;
    this.userRepository = userRepository;
  }

  @Transactional
  public BookingResponse createBooking(String userEmail, BookingCreateRequest request) {
    User user = userRepository.findByEmailIgnoreCase(userEmail)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

    Tour tour = tourRepository.findById(request.tourId())
        .filter(item -> item.getStatus() == TourStatus.PUBLISHED)
        .orElseThrow(() -> new NotFoundException("Tour không tồn tại hoặc chưa được mở bán"));

    if (request.guests() <= 0) {
      throw new BadRequestException("Số lượng khách phải lớn hơn 0");
    }

    if (tour.getSlotsAvailable() < request.guests()) {
      throw new BadRequestException("Số chỗ trống không đủ");
    }

    tour.setSlotsAvailable(tour.getSlotsAvailable() - request.guests());

    Booking booking = Booking.builder()
        .user(user)
        .tour(tour)
        .travelDate(request.travelDate())
        .guests(request.guests())
        .totalPrice(tour.getPrice().multiply(BigDecimal.valueOf(request.guests())))
        .status(BookingStatus.PENDING)
        .build();

    bookingRepository.save(booking);
    return toResponse(booking);
  }

  @Transactional
  public List<BookingResponse> getMyBookings(String userEmail) {
    return bookingRepository.findByUser_EmailIgnoreCaseOrderByCreatedAtDesc(userEmail).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public List<BookingResponse> getAllBookings() {
    return bookingRepository.findAll().stream()
        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public BookingResponse updateStatus(Long bookingId, BookingStatus newStatus) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy booking"));

    BookingStatus currentStatus = booking.getStatus();
    if (currentStatus == newStatus) {
      return toResponse(booking);
    }

    if (currentStatus != BookingStatus.CANCELLED && newStatus == BookingStatus.CANCELLED) {
      Tour tour = booking.getTour();
      tour.setSlotsAvailable(tour.getSlotsAvailable() + booking.getGuests());
    }

    booking.setStatus(newStatus);
    return toResponse(booking);
  }

  private BookingResponse toResponse(Booking booking) {
    return new BookingResponse(
        booking.getId(),
        booking.getTour().getId(),
        booking.getTour().getTitle(),
        booking.getTour().getProvince().getName(),
        booking.getTravelDate(),
        booking.getGuests(),
        booking.getTotalPrice(),
        booking.getStatus().name(),
        booking.getCreatedAt(),
        booking.getUser().getEmail(),
        booking.getUser().getFullName());
  }
}
