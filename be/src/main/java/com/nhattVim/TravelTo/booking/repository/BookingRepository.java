package com.nhattVim.TravelTo.booking.repository;

import com.nhattVim.TravelTo.booking.entity.Booking;
import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookingRepository extends JpaRepository<Booking, Long> {

  List<Booking> findByUser_EmailIgnoreCaseOrderByCreatedAtDesc(String email);

  boolean existsByTour_Id(Long tourId);

  boolean existsByDeparture_Id(Long departureId);

  void deleteByUserId(Long userId);

  boolean existsByTourIdAndUserIdAndStatus(Long tourId, Long userId, BookingStatus status);

  List<Booking> findByStatus(BookingStatus status);

  List<Booking> findByStatusAndCreatedAtBefore(BookingStatus status, java.time.Instant expiryTime);

  @Query("SELECT b FROM Booking b WHERE b.status IN ('CONFIRMED', 'COMPLETED') AND b.createdAt >= :startDate")
  List<Booking> findBookingsForRevenue(@Param("startDate") java.time.Instant startDate);

  @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status IN ('CONFIRMED', 'COMPLETED')")
  java.math.BigDecimal getTotalRevenue();

  long countByStatus(BookingStatus status);
}
