package com.nhattVim.TravelTo.tour.repository;

import com.nhattVim.TravelTo.tour.entity.TourDeparture;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourDepartureRepository extends JpaRepository<TourDeparture, Long> {

  Optional<TourDeparture> findByIdAndTour_Id(Long id, Long tourId);

  List<TourDeparture> findByTour_IdAndDepartureDateGreaterThanEqualOrderByDepartureDateAsc(Long tourId,
      LocalDate fromDate);
}
