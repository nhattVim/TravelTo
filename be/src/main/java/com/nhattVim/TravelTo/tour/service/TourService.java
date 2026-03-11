package com.nhattVim.TravelTo.tour.service;

import com.nhattVim.TravelTo.common.exception.NotFoundException;
import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.tour.dto.TourDetailResponse;
import com.nhattVim.TravelTo.tour.dto.TourListItemResponse;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TourService {

  private final TourRepository tourRepository;

  public TourService(TourRepository tourRepository) {
    this.tourRepository = tourRepository;
  }

  @Transactional(readOnly = true)
  public PagedResponse<TourListItemResponse> getTours(String provinceCode, int page, int size) {
    var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<Tour> tourPage = provinceCode == null || provinceCode.isBlank()
        ? tourRepository.findByStatus(TourStatus.PUBLISHED, pageable)
        : tourRepository.findByStatusAndProvince_CodeIgnoreCase(TourStatus.PUBLISHED, provinceCode, pageable);

    List<TourListItemResponse> items = tourPage.getContent().stream()
        .map(this::toListItem)
        .toList();

    return new PagedResponse<>(items, tourPage.getTotalElements(), tourPage.getTotalPages(), page, size);
  }

  @Transactional(readOnly = true)
  public TourDetailResponse getTourDetail(Long id) {
    Tour tour = tourRepository.findById(id)
        .filter(item -> item.getStatus() == TourStatus.PUBLISHED)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy tour"));
    return toDetail(tour);
  }

  @Transactional(readOnly = true)
  public List<TourListItemResponse> getHighlights() {
    return tourRepository.findTop6ByStatusOrderByCreatedAtDesc(TourStatus.PUBLISHED).stream()
        .map(this::toListItem)
        .toList();
  }

  private TourListItemResponse toListItem(Tour tour) {
    return new TourListItemResponse(
        tour.getId(),
        tour.getTitle(),
        tour.getSummary(),
        tour.getPrice(),
        tour.getDays(),
        tour.getNights(),
        tour.getImageUrl(),
        tour.getProvince().getCode(),
        tour.getProvince().getName(),
        tour.getSlotsAvailable());
  }

  private TourDetailResponse toDetail(Tour tour) {
    return new TourDetailResponse(
        tour.getId(),
        tour.getTitle(),
        tour.getSummary(),
        tour.getDescription(),
        tour.getPrice(),
        tour.getDays(),
        tour.getNights(),
        tour.getImageUrl(),
        tour.getProvince().getCode(),
        tour.getProvince().getName(),
        tour.getSlotsAvailable(),
        tour.getCreatedAt());
  }
}
