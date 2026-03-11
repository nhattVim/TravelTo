package com.nhattVim.TravelTo.province.service;

import com.nhattVim.TravelTo.province.dto.ProvinceOverviewResponse;
import com.nhattVim.TravelTo.province.repository.ProvinceRepository;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProvinceService {

  private final ProvinceRepository provinceRepository;
  private final TourRepository tourRepository;

  public ProvinceService(ProvinceRepository provinceRepository, TourRepository tourRepository) {
    this.provinceRepository = provinceRepository;
    this.tourRepository = tourRepository;
  }

  @Transactional(readOnly = true)
  public List<ProvinceOverviewResponse> getOverview() {
    return provinceRepository.findAll().stream()
        .map(province -> new ProvinceOverviewResponse(
            province.getId(),
            province.getCode(),
            province.getName(),
            province.getCoverImageUrl(),
            tourRepository.countByProvinceAndStatus(province, TourStatus.PUBLISHED)))
        .toList();
  }
}
