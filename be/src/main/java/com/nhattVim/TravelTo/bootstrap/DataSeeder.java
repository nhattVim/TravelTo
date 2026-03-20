package com.nhattVim.TravelTo.bootstrap;

import com.nhattVim.TravelTo.province.entity.Province;
import com.nhattVim.TravelTo.province.repository.ProvinceRepository;
import com.nhattVim.TravelTo.tour.entity.TourDeparture;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourDepartureRepository;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

  @Bean
  CommandLineRunner seedTravelData(
      ProvinceRepository provinceRepository,
      TourRepository tourRepository,
      TourDepartureRepository tourDepartureRepository) {
    return args -> {
      if (provinceRepository.count() == 0) {
        provinceRepository.saveAll(defaultProvinces());
      }

      if (tourRepository.count() == 0) {
        Map<String, Province> provinceMap = provinceRepository.findAll().stream()
            .collect(java.util.stream.Collectors.toMap(Province::getCode, Function.identity()));
        tourRepository.saveAll(defaultTours(provinceMap));
      }

      if (tourDepartureRepository.count() == 0) {
        List<Tour> tours = tourRepository.findAll();
        tourDepartureRepository.saveAll(defaultDepartures(tours));
      }

      syncTourSlots(tourRepository, tourDepartureRepository);
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
        tour(
            provinceMap.get("hanoi"),
            "Hà Nội City Vibes",
            "Khám phá phố cổ, hồ Gươm và ẩm thực đêm",
            "Hành trình 3N2Đ khám phá Hà Nội với trải nghiệm phố cổ, cà phê trứng và food tour đặc sản.",
            3290000,
            3,
            2,
            "TP. Hồ Chí Minh",
            "Hà Nội",
            "Hồ Gươm, Phố cổ, Nhà hát Lớn",
            "Phở, bún chả, cà phê trứng",
            "Nhóm bạn, cặp đôi, người đi lần đầu",
            "Quanh năm, đẹp nhất mùa thu",
            "Máy bay + xe du lịch",
            "Giảm 5% nhóm từ 4 khách",
            "Mang theo CCCD/Passport bản gốc khi làm thủ tục nhận phòng.",
            List.of(
                "https://images.unsplash.com/photo-1526481280695-3c4695d5f038?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1496560736447-e8c3f8e8f7d7?auto=format&fit=crop&w=1400&q=80")),
        tour(
            provinceMap.get("quangninh"),
            "Hạ Long Cruise Chill",
            "Du thuyền vịnh Hạ Long ngắm hoàng hôn",
            "Tour nghỉ dưỡng 2N1Đ trên du thuyền, chèo kayak, tắm biển và tiệc tối trên boong.",
            4590000,
            2,
            1,
            "Hà Nội",
            "Quảng Ninh",
            "Hang Sửng Sốt, đảo Titop, làng chài",
            "Buffet hải sản, set menu tàu",
            "Gia đình, cặp đôi",
            "Tháng 3 - tháng 10",
            "Xe du lịch + du thuyền",
            "Miễn phí kayak cho 2 khách đầu tiên",
            "Lịch trình có thể thay đổi theo thời tiết và thủy triều.",
            List.of(
                "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=1400&q=80")),
        tour(
            provinceMap.get("danang"),
            "Đà Nẵng Energy Trip",
            "Bà Nà Hills - biển Mỹ Khê - cầu Rồng",
            "Tour 4N3Đ dành cho nhóm bạn trẻ, kết hợp city tour, biển và check-in các điểm hot.",
            5690000,
            4,
            3,
            "Hà Nội",
            "Đà Nẵng",
            "Bà Nà Hills, Ngũ Hành Sơn, Hội An",
            "Đặc sản miền Trung, hải sản",
            "Nhóm bạn trẻ, team building",
            "Tháng 2 - tháng 8",
            "Máy bay + xe du lịch",
            "Tặng vé cầu Rồng cuối tuần",
            "Khách tự túc các hoạt động ngoài chương trình.",
            List.of(
                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1400&q=80")),
        tour(
            provinceMap.get("khanhhoa"),
            "Nha Trang Island Hop",
            "Lặn ngắm san hô và beach party",
            "Tour biển 3N2Đ với lịch trình đảo Hòn Mun, hải sản tươi và hoạt động dưới nước.",
            4990000,
            3,
            2,
            "TP. Hồ Chí Minh",
            "Khánh Hòa",
            "Hòn Mun, VinWonders, chợ Đầm",
            "Hải sản nướng, bún chả cá",
            "Nhóm bạn, gia đình trẻ",
            "Tháng 1 - tháng 9",
            "Máy bay + cano",
            "Combo quay phim flycam miễn phí",
            "Khuyến nghị mang đồ bơi và kem chống nắng.",
            List.of(
                "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80")),
        tour(
            provinceMap.get("dalat"),
            "Đà Lạt Mây Và Thông",
            "Săn mây - cắm trại - trekking nhẹ",
            "Hành trình chill 3N2Đ với quán cà phê đồi cao, đêm lửa trại và chợ đêm Đà Lạt.",
            3890000,
            3,
            2,
            "TP. Hồ Chí Minh",
            "Lâm Đồng",
            "Đồi chè Cầu Đất, thung lũng Tình Yêu",
            "Lẩu gà lá é, bánh căn",
            "Cặp đôi, nhóm bạn thích chill",
            "Tháng 10 - tháng 4",
            "Xe giường nằm + xe trung chuyển",
            "Tặng đêm lửa trại và BBQ",
            "Nhiệt độ ban đêm thấp, cần chuẩn bị áo ấm.",
            List.of(
                "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80")),
        tour(
            provinceMap.get("tphcm"),
            "Sài Gòn Urban Discovery",
            "Nhịp sống trẻ trung, ẩm thực và văn hóa",
            "Tour ngắn ngày cho du khách nội địa muốn khám phá Sài Gòn về đêm và các điểm văn hóa.",
            2790000,
            2,
            1,
            "Đà Nẵng",
            "TP. Hồ Chí Minh",
            "Nhà thờ Đức Bà, Bưu điện, phố đi bộ",
            "Cơm tấm, bánh mì, cà phê specialty",
            "Khách công tác, du lịch ngắn ngày",
            "Quanh năm",
            "Máy bay + city bus",
            "Tặng vé water bus",
            "Có thể phát sinh phụ phí cuối tuần/lễ tết.",
            List.of(
                "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1534929040583-0aa4f0fbc5cd?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&w=1400&q=80")),
        tour(
            provinceMap.get("phuquoc"),
            "Phú Quốc Summer Escape",
            "Resort biển xanh và sunset town",
            "Gói 4N3Đ nghỉ dưỡng cao cấp, đi cano 4 đảo và thưởng thức hải sản địa phương.",
            7590000,
            4,
            3,
            "Hà Nội",
            "Kiên Giang",
            "Grand World, Hòn Móng Tay, Sunset Town",
            "Hải sản cao cấp, bún quậy",
            "Gia đình, nghỉ dưỡng cao cấp",
            "Tháng 11 - tháng 5",
            "Máy bay + cano",
            "Tặng gói chụp ảnh hoàng hôn",
            "Khách cần có mặt trước giờ khởi hành ít nhất 45 phút.",
            List.of(
                "https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1400&q=80")),
        tour(
            provinceMap.get("ninhbinh"),
            "Ninh Bình Heritage Ride",
            "Tràng An - Tam Cốc - Bái Đính",
            "Tour 2N1Đ phù hợp cuối tuần với trải nghiệm thuyền Tràng An và đạp xe làng quê.",
            2990000,
            2,
            1,
            "Hà Nội",
            "Ninh Bình",
            "Tràng An, Hang Múa, Bái Đính",
            "Cơm cháy, dê núi",
            "Gia đình, khách nước ngoài",
            "Tháng 1 - tháng 6",
            "Xe du lịch",
            "Giảm 10% cho nhóm từ 6 khách",
            "Khách vui lòng mặc trang phục lịch sự khi vào chùa Bái Đính.",
            List.of(
                "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1533591380348-14193f1de18f?auto=format&fit=crop&w=1400&q=80",
                "https://images.unsplash.com/photo-1559127450-7a144f5c021d?auto=format&fit=crop&w=1400&q=80")));
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
      String departureLocation,
      String destinationLocation,
      String attractions,
      String cuisine,
      String suitableFor,
      String idealTime,
      String transport,
      String promotion,
      String notes,
      List<String> imageUrls) {
    return Tour.builder()
        .province(province)
        .title(title)
        .summary(summary)
        .description(description)
        .price(BigDecimal.valueOf(price))
        .days(days)
        .nights(nights)
        .imageUrl(imageUrls.getFirst())
        .imageUrls(imageUrls)
        .departureLocation(departureLocation)
        .destinationLocation(destinationLocation)
        .attractions(attractions)
        .cuisine(cuisine)
        .suitableFor(suitableFor)
        .idealTime(idealTime)
        .transport(transport)
        .promotion(promotion)
        .notes(notes)
        .slotsTotal(0)
        .slotsAvailable(0)
        .status(TourStatus.PUBLISHED)
        .build();
  }

  private List<TourDeparture> defaultDepartures(List<Tour> tours) {
    List<TourDeparture> departures = new ArrayList<>();
    for (Tour tour : tours) {
      departures.addAll(generateDepartures(tour));
    }
    return departures;
  }

  private List<TourDeparture> generateDepartures(Tour tour) {
    List<TourDeparture> departures = new ArrayList<>();
    LocalDate firstMonth = LocalDate.now().withDayOfMonth(1).plusMonths(1);
    int[] candidateDays = { 2, 9, 16, 23, 30 };

    for (int monthOffset = 0; monthOffset < 5; monthOffset++) {
      LocalDate month = firstMonth.plusMonths(monthOffset);
      for (int index = 0; index < candidateDays.length; index++) {
        int day = Math.min(candidateDays[index], month.lengthOfMonth());
        LocalDate departureDate = month.withDayOfMonth(day);
        if (departureDate.isBefore(LocalDate.now().plusDays(1))) {
          continue;
        }

        int slotsTotal = Math.max(10, tour.getDays() * 5 + 6);
        int soldSeed = index % 3;
        long priceDelta = monthOffset * 150000L + index * 70000L;

        departures.add(TourDeparture.builder()
            .tour(tour)
            .departureDate(departureDate)
            .returnDate(departureDate.plusDays(Math.max(1, tour.getDays()) - 1L))
            .price(tour.getPrice().add(BigDecimal.valueOf(priceDelta)))
            .slotsTotal(slotsTotal)
            .slotsAvailable(Math.max(0, slotsTotal - soldSeed))
            .build());
      }
    }

    return departures;
  }

  private void syncTourSlots(TourRepository tourRepository, TourDepartureRepository tourDepartureRepository) {
    Map<Long, Integer> totalByTour = tourDepartureRepository.findAll().stream()
        .collect(Collectors.groupingBy(item -> item.getTour().getId(),
            Collectors.summingInt(TourDeparture::getSlotsTotal)));

    Map<Long, Integer> availableByTour = tourDepartureRepository.findAll().stream().collect(
        Collectors.groupingBy(item -> item.getTour().getId(),
            Collectors.summingInt(TourDeparture::getSlotsAvailable)));

    List<Tour> tours = tourRepository.findAll();
    for (Tour tour : tours) {
      tour.setSlotsTotal(totalByTour.getOrDefault(tour.getId(), 0));
      tour.setSlotsAvailable(availableByTour.getOrDefault(tour.getId(), 0));
    }
    tourRepository.saveAll(tours);
  }
}
