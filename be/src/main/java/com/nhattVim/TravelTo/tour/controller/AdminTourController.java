package com.nhattVim.TravelTo.tour.controller;

import com.nhattVim.TravelTo.tour.dto.AdminTourDetailResponse;
import com.nhattVim.TravelTo.tour.dto.AdminTourDepartureUpsertRequest;
import com.nhattVim.TravelTo.tour.dto.AdminTourListItemResponse;
import com.nhattVim.TravelTo.tour.dto.AdminTourUpsertRequest;
import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.tour.dto.TourDepartureResponse;
import com.nhattVim.TravelTo.tour.service.TourService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/tours")
public class AdminTourController {

  private final TourService tourService;

  public AdminTourController(TourService tourService) {
    this.tourService = tourService;
  }

  @GetMapping
  PagedResponse<AdminTourListItemResponse> getTours(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int size) {
    return tourService.getAdminTours(page, size);
  }

  @GetMapping("/{id}")
  AdminTourDetailResponse getTourDetail(@PathVariable Long id) {
    return tourService.getAdminTourDetail(id);
  }

  @PostMapping
  ResponseEntity<AdminTourDetailResponse> createTour(@Valid @RequestBody AdminTourUpsertRequest request) {
    return ResponseEntity.ok(tourService.createAdminTour(request));
  }

  @PutMapping("/{id}")
  AdminTourDetailResponse updateTour(@PathVariable Long id, @Valid @RequestBody AdminTourUpsertRequest request) {
    return tourService.updateAdminTour(id, request);
  }

  @DeleteMapping("/{id}")
  ResponseEntity<Void> deleteTour(@PathVariable Long id) {
    tourService.deleteAdminTour(id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/{tourId}/departures")
  ResponseEntity<TourDepartureResponse> createDeparture(
      @PathVariable Long tourId,
      @Valid @RequestBody AdminTourDepartureUpsertRequest request) {
    return ResponseEntity.ok(tourService.createAdminTourDeparture(tourId, request));
  }

  @PutMapping("/{tourId}/departures/{departureId}")
  TourDepartureResponse updateDeparture(
      @PathVariable Long tourId,
      @PathVariable Long departureId,
      @Valid @RequestBody AdminTourDepartureUpsertRequest request) {
    return tourService.updateAdminTourDeparture(tourId, departureId, request);
  }

  @DeleteMapping("/{tourId}/departures/{departureId}")
  ResponseEntity<Void> deleteDeparture(@PathVariable Long tourId, @PathVariable Long departureId) {
    tourService.deleteAdminTourDeparture(tourId, departureId);
    return ResponseEntity.noContent().build();
  }
}
