package com.nhattVim.TravelTo.tour.service;

import com.nhattVim.TravelTo.booking.repository.BookingRepository;
import com.nhattVim.TravelTo.common.exception.BadRequestException;
import com.nhattVim.TravelTo.common.exception.NotFoundException;
import com.nhattVim.TravelTo.tour.dto.AdminTourDetailResponse;
import com.nhattVim.TravelTo.tour.dto.AdminTourDepartureUpsertRequest;
import com.nhattVim.TravelTo.tour.dto.AdminTourListItemResponse;
import com.nhattVim.TravelTo.tour.dto.AdminTourUpsertRequest;
import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.tour.dto.TourDetailResponse;
import com.nhattVim.TravelTo.tour.dto.TourDepartureResponse;
import com.nhattVim.TravelTo.tour.dto.TourFilterOptionsResponse;
import com.nhattVim.TravelTo.tour.dto.TourListItemResponse;
import com.nhattVim.TravelTo.tour.entity.TourDeparture;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourDepartureRepository;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import java.math.BigDecimal;
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
  private final BookingRepository bookingRepository;

  public TourService(
      TourRepository tourRepository,
      TourDepartureRepository tourDepartureRepository,
      BookingRepository bookingRepository) {
    this.tourRepository = tourRepository;
    this.tourDepartureRepository = tourDepartureRepository;
    this.bookingRepository = bookingRepository;
  }

  @Transactional(readOnly = true)
  public PagedResponse<TourListItemResponse> getTours(
      String provinceCode,
      String departureLocation,
      String destinationLocation,
      BigDecimal minPrice,
      BigDecimal maxPrice,
      int page,
      int size) {
    var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    Page<Tour> tourPage = tourRepository.searchPublished(
        TourStatus.PUBLISHED,
        provinceCode,
        departureLocation,
        destinationLocation,
        minPrice,
        maxPrice,
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
  public PagedResponse<AdminTourListItemResponse> getAdminTours(int page, int size) {
    var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "updatedAt"));
    Page<Tour> tourPage = tourRepository.findAll(pageable);

    List<AdminTourListItemResponse> items = tourPage.getContent().stream()
        .map(this::toAdminListItem)
        .toList();

    return new PagedResponse<>(items, tourPage.getTotalElements(), tourPage.getTotalPages(), page, size);
  }

  @Transactional(readOnly = true)
  public AdminTourDetailResponse getAdminTourDetail(Long id) {
    Tour tour = tourRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy tour"));
    return toAdminDetail(tour);
  }

  @Transactional
  public AdminTourDetailResponse createAdminTour(AdminTourUpsertRequest request) {
    Tour tour = new Tour();
    applyUpsert(tour, request);
    Tour saved = tourRepository.save(tour);
    recalculateSlots(saved);
    return toAdminDetail(saved);
  }

  @Transactional
  public AdminTourDetailResponse updateAdminTour(Long id, AdminTourUpsertRequest request) {
    Tour tour = tourRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy tour"));
    applyUpsert(tour, request);
    Tour saved = tourRepository.save(tour);
    recalculateSlots(saved);
    return toAdminDetail(saved);
  }

  @Transactional
  public void deleteAdminTour(Long id) {
    Tour tour = tourRepository.findById(id)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy tour"));

    if (bookingRepository.existsByTour_Id(id)) {
      throw new BadRequestException("Không thể xóa tour đã phát sinh booking");
    }

    tourDepartureRepository.deleteByTour_Id(id);
    tourRepository.delete(tour);
  }

  @Transactional
  public TourDepartureResponse createAdminTourDeparture(Long tourId, AdminTourDepartureUpsertRequest request) {
    Tour tour = findTourOrThrow(tourId);
    validateDepartureRequest(request);

    if (tourDepartureRepository.findByTour_IdAndDepartureDate(tourId, request.departureDate()).isPresent()) {
      throw new BadRequestException("Đợt khởi hành đã tồn tại cho ngày này");
    }

    TourDeparture departure = TourDeparture.builder()
        .tour(tour)
        .departureDate(request.departureDate())
        .returnDate(request.returnDate())
        .price(request.price())
        .slotsTotal(request.slotsTotal())
        .slotsAvailable(request.slotsAvailable())
        .build();

    TourDeparture saved = tourDepartureRepository.save(departure);
    recalculateSlots(tour);
    return toDepartureResponse(saved);
  }

  @Transactional
  public TourDepartureResponse updateAdminTourDeparture(
      Long tourId,
      Long departureId,
      AdminTourDepartureUpsertRequest request) {
    Tour tour = findTourOrThrow(tourId);
    TourDeparture departure = tourDepartureRepository.findByIdAndTour_Id(departureId, tourId)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy đợt khởi hành"));

    validateDepartureRequest(request);

    tourDepartureRepository.findByTour_IdAndDepartureDate(tourId, request.departureDate())
        .filter(item -> !item.getId().equals(departureId))
        .ifPresent(item -> {
          throw new BadRequestException("Đợt khởi hành đã tồn tại cho ngày này");
        });

    departure.setDepartureDate(request.departureDate());
    departure.setReturnDate(request.returnDate());
    departure.setPrice(request.price());
    departure.setSlotsTotal(request.slotsTotal());
    departure.setSlotsAvailable(request.slotsAvailable());

    TourDeparture saved = tourDepartureRepository.save(departure);
    recalculateSlots(tour);
    return toDepartureResponse(saved);
  }

  @Transactional
  public void deleteAdminTourDeparture(Long tourId, Long departureId) {
    Tour tour = findTourOrThrow(tourId);
    TourDeparture departure = tourDepartureRepository.findByIdAndTour_Id(departureId, tourId)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy đợt khởi hành"));

    if (bookingRepository.existsByDeparture_Id(departureId)) {
      throw new BadRequestException("Không thể xóa đợt khởi hành đã có booking");
    }

    tourDepartureRepository.delete(departure);
    recalculateSlots(tour);
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
        tour.getProvinceCode(),
        tour.getProvinceName(),
        tour.getDepartureLocation(),
        tour.getDestinationLocation(),
        tour.getSlotsAvailable());
  }

  private AdminTourListItemResponse toAdminListItem(Tour tour) {
    return new AdminTourListItemResponse(
        tour.getId(),
        tour.getTitle(),
        tour.getProvinceCode(),
        tour.getProvinceName(),
        tour.getPrice(),
        tour.getStatus().name(),
        tour.getDays(),
        tour.getNights(),
        tour.getDepartureLocation(),
        tour.getDestinationLocation(),
        tour.getSlotsTotal(),
        tour.getSlotsAvailable(),
        tour.getUpdatedAt());
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
        tour.getProvinceCode(),
        tour.getProvinceName(),
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

  private AdminTourDetailResponse toAdminDetail(Tour tour) {
    List<String> imageUrls = tour.getImageUrls() == null ? new ArrayList<>() : new ArrayList<>(tour.getImageUrls());
    if (imageUrls.isEmpty() && tour.getImageUrl() != null && !tour.getImageUrl().isBlank()) {
      imageUrls.add(tour.getImageUrl());
    }

    List<TourDepartureResponse> departures = tourDepartureRepository
        .findByTour_IdOrderByDepartureDateAsc(tour.getId())
        .stream()
        .map(item -> new TourDepartureResponse(
            item.getId(),
            item.getDepartureDate(),
            item.getReturnDate(),
            item.getPrice(),
            item.getSlotsTotal(),
            item.getSlotsAvailable()))
        .toList();

    return new AdminTourDetailResponse(
        tour.getId(),
        tour.getTitle(),
        tour.getSummary(),
        tour.getDescription(),
        tour.getPrice(),
        tour.getDays(),
        tour.getNights(),
        tour.getImageUrl(),
        imageUrls,
        tour.getProvinceCode(),
        tour.getProvinceName(),
        tour.getDepartureLocation(),
        tour.getDestinationLocation(),
        tour.getSlotsTotal(),
        tour.getSlotsAvailable(),
        tour.getStatus().name(),
        tour.getCreatedAt(),
        tour.getUpdatedAt(),
        departures,
        new AdminTourDetailResponse.TourAdditionalInfo(
            tour.getAttractions(),
            tour.getCuisine(),
            tour.getSuitableFor(),
            tour.getIdealTime(),
            tour.getTransport(),
            tour.getPromotion(),
            tour.getNotes()));
  }

  private void applyUpsert(Tour tour, AdminTourUpsertRequest request) {
    List<String> normalizedImageUrls = normalizeImageUrls(request.imageUrls());

    tour.setProvinceCode(request.provinceCode().trim().toLowerCase());
    tour.setProvinceName(
        request.provinceName() != null && !request.provinceName().isBlank() ? request.provinceName().trim()
            : request.provinceCode().trim());
    tour.setTitle(request.title().trim());
    tour.setSummary(request.summary().trim());
    tour.setDescription(request.description().trim());
    tour.setPrice(request.price());
    tour.setDays(request.days());
    tour.setNights(request.nights());
    tour.setImageUrls(normalizedImageUrls);
    tour.setImageUrl(resolvePrimaryImage(request.imageUrl(), normalizedImageUrls));
    tour.setDepartureLocation(request.departureLocation().trim());
    tour.setDestinationLocation(request.destinationLocation().trim());
    tour.setAttractions(normalizeOptional(request.attractions()));
    tour.setCuisine(normalizeOptional(request.cuisine()));
    tour.setSuitableFor(normalizeOptional(request.suitableFor()));
    tour.setIdealTime(normalizeOptional(request.idealTime()));
    tour.setTransport(normalizeOptional(request.transport()));
    tour.setPromotion(normalizeOptional(request.promotion()));
    tour.setNotes(normalizeOptional(request.notes()));
    tour.setStatus(request.status());
  }

  private List<String> normalizeImageUrls(List<String> rawImageUrls) {
    if (rawImageUrls == null) {
      return new ArrayList<>();
    }

    return new ArrayList<>(rawImageUrls.stream()
        .filter(item -> item != null && !item.isBlank())
        .map(String::trim)
        .toList());
  }

  private String resolvePrimaryImage(String imageUrl, List<String> imageUrls) {
    if (imageUrl != null && !imageUrl.isBlank()) {
      return imageUrl.trim();
    }

    if (!imageUrls.isEmpty()) {
      return imageUrls.getFirst();
    }

    return null;
  }

  private String normalizeOptional(String value) {
    if (value == null || value.isBlank()) {
      return null;
    }
    return value.trim();
  }

  private void recalculateSlots(Tour tour) {
    List<TourDeparture> departures = tourDepartureRepository.findByTour_IdOrderByDepartureDateAsc(tour.getId());

    int slotsTotal = departures.stream().mapToInt(TourDeparture::getSlotsTotal).sum();
    int slotsAvailable = departures.stream().mapToInt(TourDeparture::getSlotsAvailable).sum();

    tour.setSlotsTotal(slotsTotal);
    tour.setSlotsAvailable(Math.max(0, slotsAvailable));
    tourRepository.save(tour);
  }

  private Tour findTourOrThrow(Long tourId) {
    return tourRepository.findById(tourId)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy tour"));
  }

  private void validateDepartureRequest(AdminTourDepartureUpsertRequest request) {
    if (request.returnDate().isBefore(request.departureDate())) {
      throw new BadRequestException("Ngày về phải lớn hơn hoặc bằng ngày đi");
    }

    if (request.slotsAvailable() > request.slotsTotal()) {
      throw new BadRequestException("slotsAvailable không được lớn hơn slotsTotal");
    }

    if (request.price().compareTo(BigDecimal.ZERO) <= 0) {
      throw new BadRequestException("price phải lớn hơn 0");
    }
  }

  private TourDepartureResponse toDepartureResponse(TourDeparture departure) {
    return new TourDepartureResponse(
        departure.getId(),
        departure.getDepartureDate(),
        departure.getReturnDate(),
        departure.getPrice(),
        departure.getSlotsTotal(),
        departure.getSlotsAvailable());
  }
}
