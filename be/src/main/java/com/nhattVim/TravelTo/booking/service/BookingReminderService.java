package com.nhattVim.TravelTo.booking.service;

import com.nhattVim.TravelTo.booking.entity.Booking;
import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import com.nhattVim.TravelTo.booking.repository.BookingRepository;
import com.nhattVim.TravelTo.common.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingReminderService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    /**
     * Run every day at 8:00 AM
     * 0 0 8 * * ? (Second, Minute, Hour, Day of month, Month, Day of week)
     */
    @Scheduled(cron = "0 0 8 * * ?")
    @Transactional(readOnly = true)
    public void sendDepartureReminders() {
        log.info("Starting scheduled task: sendDepartureReminders");
        
        // Find bookings that are starting in exactly 3 days
        LocalDate targetDate = LocalDate.now().plusDays(3);
        
        // Using a custom query would be better, but we'll fetch confirmed bookings and filter
        // Or we can add a method to repository
        List<Booking> upcomingBookings = bookingRepository.findByStatus(BookingStatus.CONFIRMED).stream()
                .filter(b -> b.getTravelDate() != null && b.getTravelDate().isEqual(targetDate))
                .toList();
                
        log.info("Found {} bookings starting on {}", upcomingBookings.size(), targetDate);
        
        for (Booking booking : upcomingBookings) {
            try {
                sendReminderEmail(booking);
                log.info("Sent reminder email for booking ID: {}", booking.getId());
            } catch (Exception e) {
                log.error("Failed to send reminder email for booking ID: {}", booking.getId(), e);
            }
        }
        
        log.info("Finished scheduled task: sendDepartureReminders");
    }

    private void sendReminderEmail(Booking booking) {
        String to = booking.getUser().getEmail();
        String subject = "Nhắc nhở: Chuyến đi của bạn sắp khởi hành!";
        
        String formattedDate = booking.getTravelDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
        
        String body = String.format("""
            <html>
            <body>
                <h2>Xin chào %s,</h2>
                <p>TravelTo xin nhắc bạn rằng chuyến đi <strong>%s</strong> của bạn sẽ khởi hành vào ngày <strong>%s</strong>.</p>
                <p>Vui lòng chuẩn bị đầy đủ hành lý và giấy tờ tùy thân cần thiết.</p>
                <h3>Thông tin chuyến đi:</h3>
                <ul>
                    <li>Mã đặt chỗ: #%d</li>
                    <li>Điểm khởi hành: %s</li>
                    <li>Số khách: %d</li>
                </ul>
                <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua tổng đài hỗ trợ.</p>
                <p>Chúc bạn có một chuyến đi vui vẻ!</p>
                <br>
                <p>Trân trọng,<br>Đội ngũ TravelTo</p>
            </body>
            </html>
            """,
            booking.getContactName() != null ? booking.getContactName() : booking.getUser().getFullName(),
            booking.getTour().getTitle(),
            formattedDate,
            booking.getId(),
            booking.getTour().getDepartureLocation(),
            booking.getGuests()
        );
        
        emailService.sendHtmlEmail(to, subject, body);
    }
}
