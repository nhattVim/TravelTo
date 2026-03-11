package com.nhattVim.TravelTo.tour.repository;

import com.nhattVim.TravelTo.province.entity.Province;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TourRepository extends JpaRepository<Tour, Long> {

  Page<Tour> findByStatus(TourStatus status, Pageable pageable);

  Page<Tour> findByStatusAndProvince_CodeIgnoreCase(TourStatus status, String provinceCode, Pageable pageable);

  long countByProvinceAndStatus(Province province, TourStatus status);

  List<Tour> findTop6ByStatusOrderByCreatedAtDesc(TourStatus status);
}
