package com.nhattVim.TravelTo.tour.service;

import com.nhattVim.TravelTo.common.exception.NotFoundException;
import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.tour.dto.TourDetailResponse;
import com.nhattVim.TravelTo.tour.dto.TourDepartureResponse;
import com.nhattVim.TravelTo.tour.dto.TourFilterOptionsResponse;
import com.nhattVim.TravelTo.tour.dto.TourListItemResponse;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourDepartureRepository;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TourService {

  private final TourRepository tourRepository;
  private final TourDepartureRepository tourDepartureRepository;

  public TourService(TourRepository tourRepository, TourDepartureRepository tourDepartureRepository) {
    this.tourRepository = tourRepository;
    this.tourDepartureRepository = tourDepartureRepository;
  }

  @Transactional(readOnly = true)
  public PagedResponse<TourListItemResponse> getTours(
      String provinceCode,
      String departureLocation,
      String destinationLocation,
      int page,
      int size) {
    var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<Tour> tourPage = tourRepository.searchPublished(
        TourStatus.PUBLISHED,
        provinceCode,
        departureLocation,
        destinationLocation,
        pageable);

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
  public TourFilterOptionsResponse getTourFilterOptions() {
    return new TourFilterOptionsResponse(
        tourRepository.findDistinctDepartureLocations(TourStatus.PUBLISHED),
        tourRepository.findDistinctDestinationLocations(TourStatus.PUBLISHED));
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
        tour.getDepartureLocation(),
        tour.getDestinationLocation(),
        tour.getSlotsAvailable());
  }

  private TourDetailResponse toDetail(Tour tour) {
    List<String> imageUrls = tour.getImageUrls() == null ? new ArrayList<>() : new ArrayList<>(tour.getImageUrls());
    if (imageUrls.isEmpty() && tour.getImageUrl() != null && !tour.getImageUrl().isBlank()) {
      imageUrls.add(tour.getImageUrl());
    }

    List<TourDepartureResponse> departures = tourDepartureRepository
        .findByTour_IdAndDepartureDateGreaterThanEqualOrderByDepartureDateAsc(tour.getId(), LocalDate.now())
        .stream()
        .map(item -> new TourDepartureResponse(
            item.getId(),
            item.getDepartureDate(),
            item.getReturnDate(),
            item.getPrice(),
            item.getSlotsTotal(),
            item.getSlotsAvailable()))
        .toList();

    return new TourDetailResponse(
        tour.getId(),
        tour.getTitle(),
        tour.getSummary(),
        tour.getDescription(),
        tour.getPrice(),
        tour.getDays(),
        tour.getNights(),
        tour.getImageUrl(),
        imageUrls,
        tour.getProvince().getCode(),
        tour.getProvince().getName(),
        tour.getDepartureLocation(),
        tour.getDestinationLocation(),
        tour.getSlotsAvailable(),
        tour.getCreatedAt(),
        departures,
        new TourDetailResponse.TourAdditionalInfo(
            tour.getAttractions(),
            tour.getCuisine(),
            tour.getSuitableFor(),
            tour.getIdealTime(),
            tour.getTransport(),
            tour.getPromotion(),
            tour.getNotes()));
  }
}
