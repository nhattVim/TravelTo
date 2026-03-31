package com.nhattVim.TravelTo.bootstrap;

import com.nhattVim.TravelTo.tour.entity.TourDeparture;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourDepartureRepository;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import com.nhattVim.TravelTo.booking.entity.Booking;
import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import com.nhattVim.TravelTo.booking.repository.BookingRepository;
import com.nhattVim.TravelTo.user.entity.AuthProvider;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.entity.UserRole;
import com.nhattVim.TravelTo.user.entity.Wishlist;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import com.nhattVim.TravelTo.user.repository.WishlistRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

  @Bean
  CommandLineRunner seedTravelData(
      TourRepository tourRepository,
      TourDepartureRepository tourDepartureRepository,
      UserRepository userRepository,
      BookingRepository bookingRepository,
      WishlistRepository wishlistRepository) {
    return args -> {
      if (userRepository.count() == 0) {
        userRepository.saveAll(defaultUsers());
      }

      if (tourRepository.count() == 0) {
        tourRepository.saveAll(defaultTours());
      }

      if (tourDepartureRepository.count() == 0) {
        List<Tour> tours = tourRepository.findAll();
        tourDepartureRepository.saveAll(defaultDepartures(tours));
      }

      syncTourSlots(tourRepository, tourDepartureRepository);

      if (bookingRepository.count() == 0) {
        List<User> users = userRepository.findAll();
        List<TourDeparture> departures = tourDepartureRepository.findAll();
        bookingRepository.saveAll(generateBookings(users, departures));
      }

      if (wishlistRepository.count() == 0) {
        Random random = new Random();
        List<User> users = userRepository.findAll();
        List<Tour> tours = tourRepository.findAll();
        List<Wishlist> wishlists = new ArrayList<>();
        for (User user : users) {
          int wishlistCount = random.nextInt(4);
          for (int i = 0; i < wishlistCount; i++) {
            Tour tour = tours.get(random.nextInt(tours.size()));
            boolean exists = wishlists.stream()
                .anyMatch(w -> w.getUser().getId().equals(user.getId()) && w.getTour().getId().equals(tour.getId()));
            if (!exists) {
              wishlists.add(Wishlist.builder().user(user).tour(tour).build());
            }
          }
        }
        wishlistRepository.saveAll(wishlists);
      }
    };
  }

  private List<User> defaultUsers() {
    return List.of(
        User.builder()
            .email("admin@travelto.com")
            .fullName("Admin TravelTo")
            .phone("0987654321")
            .address("123 Trần Duy Hưng, Hà Nội")
            .provider(AuthProvider.GOOGLE)
            .providerUserId("admin_google_123")
            .role(UserRole.ADMIN)
            .build(),
        User.builder()
            .email("customer1@gmail.com")
            .fullName("Nguyễn Văn Khách")
            .phone("0901234567")
            .address("456 Lê Lợi, TP.HCM")
            .provider(AuthProvider.GOOGLE)
            .providerUserId("cust1_google_123")
            .role(UserRole.USER)
            .build(),
        User.builder()
            .email("customer2@gmail.com")
            .fullName("Trần Thị Bách")
            .phone("0912345678")
            .address("789 Nguyễn Văn Linh, Đà Nẵng")
            .provider(AuthProvider.GOOGLE)
            .providerUserId("cust2_google_123")
            .role(UserRole.USER)
            .build(),
        User.builder()
            .email("nhattruong13112000@gmail.com")
            .fullName("Nhật Trường")
            .phone("0899999999")
            .address("Quận 1, TP.HCM")
            .provider(AuthProvider.GOOGLE)
            .providerUserId("truong_google_123")
            .role(UserRole.ADMIN)
            .build());
  }

  private List<Booking> generateBookings(List<User> users, List<TourDeparture> departures) {
    List<Booking> bookings = new ArrayList<>();
    Random random = new Random();
    List<User> customerPool = users.stream().filter(u -> u.getRole() == UserRole.USER).toList();
    if (customerPool.isEmpty()) {
      customerPool = users;
    }

    for (int i = 0; i < 30; i++) {
      User user = customerPool.get(random.nextInt(customerPool.size()));
      TourDeparture departure = departures.get(random.nextInt(departures.size()));
      int guests = random.nextInt(3) + 1;

      BookingStatus status = BookingStatus.CONFIRMED;
      int statusRand = random.nextInt(10);
      if (statusRand < 2)
        status = BookingStatus.PENDING;
      else if (statusRand < 4)
        status = BookingStatus.CANCELLED;

      bookings.add(Booking.builder()
          .user(user)
          .tour(departure.getTour())
          .departure(departure)
          .travelDate(departure.getDepartureDate())
          .guests(guests)
          .totalPrice(departure.getPrice().multiply(BigDecimal.valueOf(guests)))
          .status(status)
          .build());
    }
    return bookings;
  }

  private List<Tour> defaultTours() {
    return List.of(
        tour(
            "ha_noi", "Thành phố Hà Nội",
            "Hà Nội City Vibes",
            "Khám phá phố cổ, hồ Gươm và ẩm thực đêm",
            "Hành trình 3N2Đ khám phá Hà Nội với trải nghiệm phố cổ, cà phê trứng và food tour đặc sản.",
            3290000,
            3,
            2,
            "Thành phố Hồ Chí Minh",
            "Thành phố Hà Nội",
            "Hồ Gươm, Phố cổ, Nhà hát Lớn",
            "Phở, bún chả, cà phê trứng",
            "Nhóm bạn, cặp đôi, người đi lần đầu",
            "Quanh năm, đẹp nhất mùa thu",
            "Máy bay + xe du lịch",
            "Giảm 5% nhóm từ 4 khách",
            "Mang theo CCCD/Passport bản gốc khi làm thủ tục nhận phòng.",
            List.of(
                "https://bizweb.dktcdn.net/100/520/450/products/hanoi-city-tour-full-day-1.jpg?v=1723388645833",
                "https://images.vietnamtourism.gov.vn/vn/images/2023/thang_2/ha_noi.jpg",
                "https://bizweb.dktcdn.net/100/094/983/files/1-copy-61d63377-853f-4646-8a69-b61d68cce5d8.jpg?v=1584712694126")),
        tour(
            "quang_ninh", "Tỉnh Quảng Ninh",
            "Hạ Long Cruise Chill",
            "Du thuyền vịnh Hạ Long ngắm hoàng hôn",
            "Tour nghỉ dưỡng 2N1Đ trên du thuyền, chèo kayak, tắm biển và tiệc tối trên boong.",
            4590000,
            2,
            1,
            "Thành phố Hà Nội",
            "Tỉnh Quảng Ninh",
            "Hang Sửng Sốt, đảo Titop, làng chài",
            "Buffet hải sản, set menu tàu",
            "Gia đình, cặp đôi",
            "Tháng 3 - tháng 10",
            "Xe du lịch + du thuyền",
            "Miễn phí kayak cho 2 khách đầu tiên",
            "Lịch trình có thể thay đổi theo thời tiết và thủy triều.",
            List.of(
                "https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/q1-1715919826481.jpg",
                "https://htsinternationaltravel.com/uploads/Article/diem-den/ha-long.jpg",
                "https://haiphongtravel.vn/wp-content/uploads/2023/07/quang-ninh-pt-16819611650471186998509.jpg")),
        tour(
            "da_nang", "Thành phố Đà Nẵng",
            "Đà Nẵng Energy Trip",
            "Bà Nà Hills - biển Mỹ Khê - cầu Rồng",
            "Tour 4N3Đ dành cho nhóm bạn trẻ, kết hợp city tour, biển và check-in các điểm hot.",
            5690000,
            4,
            3,
            "Thành phố Hà Nội",
            "Thành phố Đà Nẵng",
            "Bà Nà Hills, Ngũ Hành Sơn, Hội An",
            "Đặc sản miền Trung, hải sản",
            "Nhóm bạn trẻ, team building",
            "Tháng 2 - tháng 8",
            "Máy bay + xe du lịch",
            "Tặng vé cầu Rồng cuối tuần",
            "Khách tự túc các hoạt động ngoài chương trình.",
            List.of(
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ12c3wGkf6fJh63JeqKdlMz8eRPxuZnRPdUQ&s",
                "https://hoangphuan.com/wp-content/uploads/2024/05/Danangbanner2600x11110-scaled.webp",
                "https://themetravel.com.vn/upload/product/796434_h2.jpg")),
        tour(
            "khanh_hoa", "Tỉnh Khánh Hòa",
            "Nha Trang Island Hop",
            "Lặn ngắm san hô và beach party",
            "Tour biển 3N2Đ với lịch trình đảo Hòn Mun, hải sản tươi và hoạt động dưới nước.",
            4990000,
            3,
            2,
            "Thành phố Hồ Chí Minh",
            "Tỉnh Khánh Hòa",
            "Hòn Mun, VinWonders, chợ Đầm",
            "Hải sản nướng, bún chả cá",
            "Nhóm bạn, gia đình trẻ",
            "Tháng 1 - tháng 9",
            "Máy bay + cano",
            "Combo quay phim flycam miễn phí",
            "Khuyến nghị mang đồ bơi và kem chống nắng.",
            List.of(
                "https://bizweb.dktcdn.net/100/514/927/files/du-lich-khanh-hoa-phan-van-travel-1.webp?v=1766392334620",
                "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1746805998.jpg&w=750&q=75",
                "https://cdn1.vietnamtourism.org.vn/images/content/2011-11-17.11.03.14-khanhh%C3%B2a.jpg")),
        tour(
            "lam_dong", "Tỉnh Lâm Đồng",
            "Đà Lạt Mây Và Thông",
            "Săn mây - cắm trại - trekking nhẹ",
            "Hành trình chill 3N2Đ với quán cà phê đồi cao, đêm lửa trại và chợ đêm Đà Lạt.",
            3890000,
            3,
            2,
            "Thành phố Hồ Chí Minh",
            "Tỉnh Lâm Đồng",
            "Đồi chè Cầu Đất, thung lũng Tình Yêu",
            "Lẩu gà lá é, bánh căn",
            "Cặp đôi, nhóm bạn thích chill",
            "Tháng 10 - tháng 4",
            "Xe giường nằm + xe trung chuyển",
            "Tặng đêm lửa trại và BBQ",
            "Nhiệt độ ban đêm thấp, cần chuẩn bị áo ấm.",
            List.of(
                "https://2025.vietnam.travel/wp-content/uploads/2025/05/0805.lamdongdl1.jpg",
                "https://bizweb.dktcdn.net/100/514/927/files/du-lich-lam-dong-1.webp?v=1773204043160",
                "https://bizweb.dktcdn.net/100/514/927/files/du-lich-lam-dong-4.webp?v=1773204043100")),
        tour(
            "ho_chi_minh", "Thành phố Hồ Chí Minh",
            "Sài Gòn Urban Discovery",
            "Nhịp sống trẻ trung, ẩm thực và văn hóa",
            "Tour ngắn ngày cho du khách nội địa muốn khám phá Sài Gòn về đêm và các điểm văn hóa.",
            2790000,
            2,
            1,
            "Thành phố Đà Nẵng",
            "Thành phố Hồ Chí Minh",
            "Nhà thờ Đức Bà, Bưu điện, phố đi bộ",
            "Cơm tấm, bánh mì, cà phê specialty",
            "Khách công tác, du lịch ngắn ngày",
            "Quanh năm",
            "Máy bay + city bus",
            "Tặng vé water bus",
            "Có thể phát sinh phụ phí cuối tuần/lễ tết.",
            List.of(
                "https://vmtravel.com.vn/wp-content/uploads/2022/10/The_Old_Central_Post_Office.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_ajosubVwPowV-1BeXCCn-7NpG_3mxACqXg&s",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuKhj9JVMo6uE87P3OxVK-7H0NNTiuB2a8hA&s")),
        tour(
            "kien_giang", "Tỉnh Kiên Giang",
            "Phú Quốc Summer Escape",
            "Resort biển xanh và sunset town",
            "Gói 4N3Đ nghỉ dưỡng cao cấp, đi cano 4 đảo và thưởng thức hải sản địa phương.",
            7590000,
            4,
            3,
            "Thành phố Hà Nội",
            "Tỉnh Kiên Giang",
            "Grand World, Hòn Móng Tay, Sunset Town",
            "Hải sản cao cấp, bún quậy",
            "Gia đình, nghỉ dưỡng cao cấp",
            "Tháng 11 - tháng 5",
            "Máy bay + cano",
            "Tặng gói chụp ảnh hoàng hôn",
            "Khách cần có mặt trước giờ khởi hành ít nhất 45 phút.",
            List.of(
                "https://pystravel.vn/_next/image?url=https%3A%2F%2Fbooking.pystravel.vn%2Fuploads%2Fposts%2Favatar%2F1772418859.jpg&w=750&q=75",
                "https://ik.imagekit.io/tvlk/blog/2021/09/kinh-nghiem-du-lich-kien-giang-2.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlRiT3vy-AqW3vuxbGEml7NtPKETOmFXu06A&s")),
        tour(
            "ninh_binh", "Tỉnh Ninh Bình",
            "Ninh Bình Heritage Ride",
            "Tràng An - Tam Cốc - Bái Đính",
            "Tour 2N1Đ phù hợp cuối tuần với trải nghiệm thuyền Tràng An và đạp xe làng quê.",
            2990000,
            2,
            1,
            "Thành phố Hà Nội",
            "Tỉnh Ninh Bình",
            "Tràng An, Hang Múa, Bái Đính",
            "Cơm cháy, dê núi",
            "Gia đình, khách nước ngoài",
            "Tháng 1 - tháng 6",
            "Xe du lịch",
            "Giảm 10% cho nhóm từ 6 khách",
            "Khách vui lòng mặc trang phục lịch sự khi vào chùa Bái Đính.",
            List.of(
                "https://vcdn1-dulich.vnecdn.net/2022/04/18/dulichNinhBinhVnExpress-165027-2285-9515-1650278117.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=EKON9JHNMuFD31A1AvzEYw",
                "https://vmtravel.com.vn/wp-content/uploads/2022/11/Tam_Coc_4.jpg",
                "https://cdn.nbtv.vn/upload/news/11_2020/1_08180626112020.jpg")));
  }

  private Tour tour(
      String provinceCode,
      String provinceName,
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
        .provinceCode(provinceCode)
        .provinceName(provinceName)
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
    java.util.Random random = new java.util.Random();

    for (int monthOffset = 0; monthOffset < 5; monthOffset++) {
      LocalDate month = firstMonth.plusMonths(monthOffset);

      int day = 1 + random.nextInt(5);
      while (day <= month.lengthOfMonth()) {
        LocalDate date = month.withDayOfMonth(day);

        if (!date.isBefore(LocalDate.now().plusDays(2))) {
          int slotsTotal = Math.max(10, tour.getDays() * 5 + 6);
          int soldSeed = random.nextInt(5);
          long priceDelta = monthOffset * 150000L + random.nextInt(5) * 70000L;

          departures.add(TourDeparture.builder()
              .tour(tour)
              .departureDate(date)
              .returnDate(date.plusDays(Math.max(1, tour.getDays()) - 1L))
              .price(tour.getPrice().add(BigDecimal.valueOf(priceDelta)))
              .slotsTotal(slotsTotal)
              .slotsAvailable(Math.max(0, slotsTotal - soldSeed))
              .build());
        }

        // Jump some random days forward to next departure
        day += 5 + random.nextInt(7);
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
