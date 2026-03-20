package com.nhattVim.TravelTo.booking.repository;

import com.nhattVim.TravelTo.booking.entity.Booking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<Booking, Long> {

  List<Booking> findByUser_EmailIgnoreCaseOrderByCreatedAtDesc(String email);

  boolean existsByTour_Id(Long tourId);
}
