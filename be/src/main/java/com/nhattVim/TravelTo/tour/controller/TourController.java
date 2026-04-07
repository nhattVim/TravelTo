package com.nhattVim.TravelTo.tour.controller;

import com.nhattVim.TravelTo.tour.dto.PagedResponse;
import com.nhattVim.TravelTo.tour.dto.TourDetailResponse;
import com.nhattVim.TravelTo.tour.dto.TourFilterOptionsResponse;
import com.nhattVim.TravelTo.tour.dto.TourListItemResponse;
import com.nhattVim.TravelTo.tour.service.TourService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class TourController {

  private final TourService tourService;

  public TourController(TourService tourService) {
    this.tourService = tourService;
  }

  @GetMapping("/tours")
  PagedResponse<TourListItemResponse> getTours(
      @RequestParam(required = false) String provinceCode,
      @RequestParam(required = false) String departureLocation,
      @RequestParam(required = false) String destinationLocation,
      @RequestParam(required = false) BigDecimal minPrice,
      @RequestParam(required = false) BigDecimal maxPrice,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "9") int size) {
    return tourService.getTours(provinceCode, departureLocation, destinationLocation, minPrice, maxPrice, page, size);
  }

  @GetMapping("/tours/filters")
  TourFilterOptionsResponse getTourFilterOptions() {
    return tourService.getTourFilterOptions();
  }

  @GetMapping("/tours/{id}")
  TourDetailResponse getTourDetail(@PathVariable Long id) {
    return tourService.getTourDetail(id);
  }

  @GetMapping("/home/highlights")
  List<TourListItemResponse> getHighlights() {
    return tourService.getHighlights();
  }
}
