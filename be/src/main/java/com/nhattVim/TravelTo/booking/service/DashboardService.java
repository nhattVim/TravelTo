package com.nhattVim.TravelTo.booking.service;

import com.nhattVim.TravelTo.booking.dto.DashboardStatsDto;
import com.nhattVim.TravelTo.booking.dto.MonthlyRevenueDto;
import com.nhattVim.TravelTo.booking.entity.Booking;
import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import com.nhattVim.TravelTo.booking.repository.BookingRepository;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TourRepository tourRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        // Lấy dữ liệu 6 tháng gần nhất
        Instant sixMonthsAgo = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"))
                .minus(5, ChronoUnit.MONTHS)
                .withDayOfMonth(1)
                .toInstant();

        List<Booking> recentBookings = bookingRepository.findBookingsForRevenue(sixMonthsAgo);
        
        // Group by month
        Map<String, MonthlyRevenueDto> monthlyMap = new TreeMap<>();
        
        // Initialize all 6 months to zero to ensure they appear on the chart
        for (int i = 5; i >= 0; i--) {
            ZonedDateTime month = ZonedDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh")).minus(i, ChronoUnit.MONTHS);
            String monthStr = String.format("%04d-%02d", month.getYear(), month.getMonthValue());
            monthlyMap.put(monthStr, new MonthlyRevenueDto(monthStr, BigDecimal.ZERO, 0L));
        }

        for (Booking b : recentBookings) {
            ZonedDateTime zdt = b.getCreatedAt().atZone(ZoneId.of("Asia/Ho_Chi_Minh"));
            String monthStr = String.format("%04d-%02d", zdt.getYear(), zdt.getMonthValue());
            
            if (monthlyMap.containsKey(monthStr)) {
                MonthlyRevenueDto dto = monthlyMap.get(monthStr);
                dto.setRevenue(dto.getRevenue().add(b.getTotalPrice()));
                dto.setBookingCount(dto.getBookingCount() + 1);
            }
        }

        List<MonthlyRevenueDto> monthlyRevenue = new ArrayList<>(monthlyMap.values());
        BigDecimal totalRevenue = bookingRepository.getTotalRevenue();

        return DashboardStatsDto.builder()
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .totalBookings(bookingRepository.count())
                .pendingBookings(bookingRepository.countByStatus(BookingStatus.PENDING))
                .completedBookings(bookingRepository.countByStatus(BookingStatus.COMPLETED) + bookingRepository.countByStatus(BookingStatus.CONFIRMED))
                .totalUsers(userRepository.count())
                .totalTours(tourRepository.count())
                .monthlyRevenue(monthlyRevenue)
                .build();
    }
}
