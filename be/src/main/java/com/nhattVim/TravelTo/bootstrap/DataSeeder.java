package com.nhattVim.TravelTo.bootstrap;

import com.nhattVim.TravelTo.province.entity.Province;
import com.nhattVim.TravelTo.province.repository.ProvinceRepository;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

  @Bean
  CommandLineRunner seedTravelData(ProvinceRepository provinceRepository, TourRepository tourRepository) {
    return args -> {
      if (provinceRepository.count() == 0) {
        provinceRepository.saveAll(defaultProvinces());
      }

      if (tourRepository.count() == 0) {
        Map<String, Province> provinceMap = provinceRepository.findAll().stream()
            .collect(java.util.stream.Collectors.toMap(Province::getCode, Function.identity()));
        tourRepository.saveAll(defaultTours(provinceMap));
      }
    };
  }

  private List<Province> defaultProvinces() {
    return List.of(
        province("hanoi", "Hà Nội",
            "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80"),
        province("quangninh", "Quảng Ninh",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"),
        province("danang", "Đà Nẵng",
            "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"),
        province("khanhhoa", "Khánh Hòa",
            "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80"),
        province("dalat", "Lâm Đồng",
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80"),
        province("tphcm", "TP. Hồ Chí Minh",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80"),
        province("phuquoc", "Kiên Giang",
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"),
        province("ninhbinh", "Ninh Bình",
            "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=1200&q=80"));
  }

  private List<Tour> defaultTours(Map<String, Province> provinceMap) {
    return List.of(
        tour(provinceMap.get("hanoi"), "Hà Nội City Vibes", "Khám phá phố cổ, hồ Gươm và ẩm thực đêm",
            "Hành trình 3N2Đ khám phá Hà Nội với trải nghiệm phố cổ, cà phê trứng và food tour đặc sản.", 3290000, 3, 2,
            25, "https://images.unsplash.com/photo-1526481280695-3c4695d5f038?auto=format&fit=crop&w=1200&q=80"),
        tour(provinceMap.get("quangninh"), "Hạ Long Cruise Chill", "Du thuyền vịnh Hạ Long ngắm hoàng hôn",
            "Tour nghỉ dưỡng 2N1Đ trên du thuyền, chèo kayak, tắm biển và tiệc tối trên boong.", 4590000, 2, 1, 20,
            "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1200&q=80"),
        tour(provinceMap.get("danang"), "Đà Nẵng Energy Trip", "Bà Nà Hills - biển Mỹ Khê - cầu Rồng",
            "Tour 4N3Đ dành cho nhóm bạn trẻ, kết hợp city tour, biển và check-in các điểm hot.", 5690000, 4, 3, 30,
            "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80"),
        tour(provinceMap.get("khanhhoa"), "Nha Trang Island Hop", "Lặn ngắm san hô và beach party",
            "Tour biển 3N2Đ với lịch trình đảo Hòn Mun, hải sản tươi và hoạt động dưới nước.", 4990000, 3, 2, 26,
            "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80"),
        tour(provinceMap.get("dalat"), "Đà Lạt Mây Và Thông", "Săn mây - cắm trại - trekking nhẹ",
            "Hành trình chill 3N2Đ với quán cà phê đồi cao, đêm lửa trại và chợ đêm Đà Lạt.", 3890000, 3, 2, 28,
            "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=80"),
        tour(provinceMap.get("tphcm"), "Sài Gòn Urban Discovery", "Nhịp sống trẻ trung, ẩm thực và văn hóa",
            "Tour ngắn ngày cho du khách nội địa muốn khám phá Sài Gòn về đêm và các điểm văn hóa.", 2790000, 2, 1, 35,
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"),
        tour(provinceMap.get("phuquoc"), "Phú Quốc Summer Escape", "Resort biển xanh và sunset town",
            "Gói 4N3Đ nghỉ dưỡng cao cấp, đi cano 4 đảo và thưởng thức hải sản địa phương.", 7590000, 4, 3, 18,
            "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=1200&q=80"),
        tour(provinceMap.get("ninhbinh"), "Ninh Bình Heritage Ride", "Tràng An - Tam Cốc - Bái Đính",
            "Tour 2N1Đ phù hợp cuối tuần với trải nghiệm thuyền Tràng An và đạp xe làng quê.", 2990000, 2, 1, 22,
            "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80"));
  }

  private Province province(String code, String name, String coverImageUrl) {
    return Province.builder()
        .code(code)
        .name(name)
        .coverImageUrl(coverImageUrl)
        .build();
  }

  private Tour tour(
      Province province,
      String title,
      String summary,
      String description,
      long price,
      int days,
      int nights,
      int slots,
      String imageUrl) {
    return Tour.builder()
        .province(province)
        .title(title)
        .summary(summary)
        .description(description)
        .price(BigDecimal.valueOf(price))
        .days(days)
        .nights(nights)
        .slotsTotal(slots)
        .slotsAvailable(slots)
        .imageUrl(imageUrl)
        .status(TourStatus.PUBLISHED)
        .build();
  }
}
