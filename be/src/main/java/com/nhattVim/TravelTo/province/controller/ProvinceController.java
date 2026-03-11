package com.nhattVim.TravelTo.province.controller;

import com.nhattVim.TravelTo.province.dto.ProvinceOverviewResponse;
import com.nhattVim.TravelTo.province.service.ProvinceService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/provinces")
public class ProvinceController {

  private final ProvinceService provinceService;

  public ProvinceController(ProvinceService provinceService) {
    this.provinceService = provinceService;
  }

  @GetMapping("/overview")
  List<ProvinceOverviewResponse> getOverview() {
    return provinceService.getOverview();
  }
}
