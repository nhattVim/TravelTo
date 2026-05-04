package com.nhattVim.TravelTo.booking.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private long totalBookings;
    private long pendingBookings;
    private long completedBookings;
    private long totalUsers;
    private long totalTours;
    private List<MonthlyRevenueDto> monthlyRevenue;
}
