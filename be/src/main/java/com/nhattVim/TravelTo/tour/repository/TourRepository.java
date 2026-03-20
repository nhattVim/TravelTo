package com.nhattVim.TravelTo.tour.repository;

import com.nhattVim.TravelTo.province.entity.Province;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TourRepository extends JpaRepository<Tour, Long> {

  @Query("""
      SELECT t
      FROM Tour t
      WHERE t.status = :status
        AND (:provinceCode IS NULL OR :provinceCode = '' OR LOWER(t.province.code) = LOWER(:provinceCode))
        AND (:departureLocation IS NULL OR :departureLocation = '' OR LOWER(t.departureLocation) = LOWER(:departureLocation))
        AND (:destinationLocation IS NULL OR :destinationLocation = '' OR LOWER(t.destinationLocation) = LOWER(:destinationLocation))
      """)
  Page<Tour> searchPublished(
      @Param("status") TourStatus status,
      @Param("provinceCode") String provinceCode,
      @Param("departureLocation") String departureLocation,
      @Param("destinationLocation") String destinationLocation,
      Pageable pageable);

  Page<Tour> findByStatus(TourStatus status, Pageable pageable);

  Page<Tour> findByStatusAndProvince_CodeIgnoreCase(TourStatus status, String provinceCode, Pageable pageable);

  long countByProvinceAndStatus(Province province, TourStatus status);

  List<Tour> findTop6ByStatusOrderByCreatedAtDesc(TourStatus status);

  @Query("""
      SELECT DISTINCT t.departureLocation
      FROM Tour t
      WHERE t.status = :status
      ORDER BY t.departureLocation ASC
      """)
  List<String> findDistinctDepartureLocations(@Param("status") TourStatus status);

  @Query("""
      SELECT DISTINCT t.destinationLocation
      FROM Tour t
      WHERE t.status = :status
      ORDER BY t.destinationLocation ASC
      """)
  List<String> findDistinctDestinationLocations(@Param("status") TourStatus status);
}
