package com.nhattVim.TravelTo.booking.service;

import com.nhattVim.TravelTo.booking.dto.BookingCreateRequest;
import com.nhattVim.TravelTo.booking.dto.BookingResponse;
import com.nhattVim.TravelTo.booking.entity.Booking;
import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import com.nhattVim.TravelTo.booking.repository.BookingRepository;
import com.nhattVim.TravelTo.common.exception.BadRequestException;
import com.nhattVim.TravelTo.common.exception.NotFoundException;
import com.nhattVim.TravelTo.tour.entity.Tour;
import com.nhattVim.TravelTo.tour.entity.TourDeparture;
import com.nhattVim.TravelTo.tour.entity.TourStatus;
import com.nhattVim.TravelTo.tour.repository.TourDepartureRepository;
import com.nhattVim.TravelTo.tour.repository.TourRepository;
import com.nhattVim.TravelTo.common.service.EmailService;
import com.nhattVim.TravelTo.user.entity.User;
import com.nhattVim.TravelTo.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class BookingService {

  private static final Logger log = LoggerFactory.getLogger(BookingService.class);

  private final BookingRepository bookingRepository;
  private final TourRepository tourRepository;
  private final TourDepartureRepository tourDepartureRepository;
  private final UserRepository userRepository;
  private final EmailService emailService;

  public BookingService(BookingRepository bookingRepository, TourRepository tourRepository,
      TourDepartureRepository tourDepartureRepository, UserRepository userRepository,
      EmailService emailService) {
    this.bookingRepository = bookingRepository;
    this.tourRepository = tourRepository;
    this.tourDepartureRepository = tourDepartureRepository;
    this.userRepository = userRepository;
    this.emailService = emailService;
  }

  @Transactional
  public BookingResponse createBooking(String userEmail, BookingCreateRequest request) {
    User user = userRepository.findByEmailIgnoreCase(userEmail)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng"));

    Tour tour = tourRepository.findById(request.tourId())
        .filter(item -> item.getStatus() == TourStatus.PUBLISHED)
        .orElseThrow(() -> new NotFoundException("Tour không tồn tại hoặc chưa được mở bán"));

    TourDeparture departure = tourDepartureRepository.findByIdAndTour_Id(request.departureId(), tour.getId())
        .orElseThrow(() -> new NotFoundException("Không tìm thấy đợt khởi hành phù hợp"));

    int adultGuests = request.adultGuests() != null ? request.adultGuests() : 1;
    int childGuests = request.childGuests() != null ? request.childGuests() : 0;
    int toddlerGuests = request.toddlerGuests() != null ? request.toddlerGuests() : 0;
    int infantGuests = request.infantGuests() != null ? request.infantGuests() : 0;
    
    int totalSlotsRequired = adultGuests + childGuests + toddlerGuests;

    if (totalSlotsRequired <= 0) {
      throw new BadRequestException("Phải có ít nhất 1 hành khách (người lớn, trẻ em hoặc trẻ nhỏ)");
    }

    if (departure.getDepartureDate().isBefore(LocalDate.now())) {
      throw new BadRequestException("Đợt khởi hành đã qua, vui lòng chọn ngày khác");
    }

    if (departure.getSlotsAvailable() < totalSlotsRequired) {
      throw new BadRequestException("Số chỗ trống không đủ");
    }

    departure.setSlotsAvailable(departure.getSlotsAvailable() - totalSlotsRequired);
    tour.setSlotsAvailable(Math.max(0, tour.getSlotsAvailable() - totalSlotsRequired));

    BigDecimal basePrice = departure.getPrice();
    BigDecimal adultPrice = basePrice.multiply(BigDecimal.valueOf(adultGuests));
    BigDecimal childPrice = basePrice.multiply(BigDecimal.valueOf(childGuests)).multiply(BigDecimal.valueOf(0.75));
    BigDecimal toddlerPrice = basePrice.multiply(BigDecimal.valueOf(toddlerGuests)).multiply(BigDecimal.valueOf(0.5));
    BigDecimal totalPrice = adultPrice.add(childPrice).add(toddlerPrice);

    Booking booking = Booking.builder()
        .user(user)
        .tour(tour)
        .departure(departure)
        .travelDate(departure.getDepartureDate())
        .guests(totalSlotsRequired)
        .adultGuests(adultGuests)
        .childGuests(childGuests)
        .toddlerGuests(toddlerGuests)
        .infantGuests(infantGuests)
        .totalPrice(totalPrice)
        .contactName(request.contactName())
        .contactPhone(request.contactPhone())
        .contactNotes(request.contactNotes())
        .status(BookingStatus.PENDING)
        .build();

    bookingRepository.save(booking);
    return toResponse(booking);
  }

  @Transactional
  public List<BookingResponse> getMyBookings(String userEmail) {
    return bookingRepository.findByUser_EmailIgnoreCaseOrderByCreatedAtDesc(userEmail).stream()
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public List<BookingResponse> getAllBookings() {
    return bookingRepository.findAll().stream()
        .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
        .map(this::toResponse)
        .toList();
  }

  @Transactional
  public BookingResponse updateStatus(Long bookingId, BookingStatus newStatus) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new NotFoundException("Không tìm thấy booking"));

    BookingStatus currentStatus = booking.getStatus();
    if (currentStatus == newStatus) {
      return toResponse(booking);
    }

    if (currentStatus != BookingStatus.CANCELLED && newStatus == BookingStatus.CANCELLED) {
      restoreSeats(booking);
    }

    if (currentStatus == BookingStatus.CANCELLED && newStatus != BookingStatus.CANCELLED) {
      reserveSeats(booking);
    }

    booking.setStatus(newStatus);

    if (newStatus == BookingStatus.CONFIRMED && currentStatus != BookingStatus.CONFIRMED) {
      try {
        sendBookingConfirmationEmail(booking);
      } catch (Exception e) {
        log.error("Failed to send booking confirmation email for booking ID: {}", booking.getId(), e);
      }
    }

    return toResponse(booking);
  }

  private void sendBookingConfirmationEmail(Booking booking) {
    String to = booking.getUser().getEmail();
    String subject = "Xác nhận đặt tour thành công - TravelTo #" + booking.getId();
    
    String formattedDate = booking.getTravelDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    String formattedPrice = String.format("%,d VNĐ", booking.getTotalPrice().longValue());
    
    List<String> guestDetails = new ArrayList<>();
    if (booking.getAdultGuests() > 0) guestDetails.add(booking.getAdultGuests() + " người lớn");
    if (booking.getChildGuests() > 0) guestDetails.add(booking.getChildGuests() + " trẻ em");
    if (booking.getToddlerGuests() > 0) guestDetails.add(booking.getToddlerGuests() + " trẻ nhỏ");
    if (booking.getInfantGuests() > 0) guestDetails.add(booking.getInfantGuests() + " em bé");
    String guestDetailsStr = String.join(", ", guestDetails);

    String notesRow = "";
    if (booking.getContactNotes() != null && !booking.getContactNotes().isBlank()) {
      notesRow = "<tr><td style=\"padding: 5px 0; color: #666;\">Ghi chú:</td><td style=\"padding: 5px 0; font-style: italic;\">" 
          + booking.getContactNotes() + "</td></tr>";
    }

    String body = String.format("""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; color: #333;">
          <div style="text-align: center; border-bottom: 2px solid #0a7d59; padding-bottom: 10px; margin-bottom: 20px;">
            <h2 style="color: #0a7d59; margin: 0;">Cảm ơn bạn đã đặt tour tại TravelTo!</h2>
          </div>
          <p>Xin chào <strong>%s</strong>,</p>
          <p>Đơn đặt chỗ của bạn đã được xác nhận thanh toán thành công. Dưới đây là thông tin chi tiết:</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #0a7d59; margin-top: 0; border-bottom: 1px dashed #ccc; padding-bottom: 5px;">Thông tin chuyến đi:</h3>
            <table style="width: 100%%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #666; width: 150px;">Mã đặt chỗ:</td>
                <td style="padding: 5px 0; font-weight: bold; color: #0a7d59;">#%d</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;">Tên tour:</td>
                <td style="padding: 5px 0; font-weight: bold;">%s</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;">Ngày khởi hành:</td>
                <td style="padding: 5px 0;">%s</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;">Điểm khởi hành:</td>
                <td style="padding: 5px 0;">%s</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;">Số lượng khách:</td>
                <td style="padding: 5px 0;">%d hành khách (%s)</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;">Tổng thanh toán:</td>
                <td style="padding: 5px 0; font-weight: bold; color: #d14f4f; font-size: 16px;">%s</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="color: #0a7d59; margin-top: 0; border-bottom: 1px dashed #ccc; padding-bottom: 5px;">Thông tin liên hệ:</h3>
            <table style="width: 100%%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #666; width: 150px;">Người liên hệ:</td>
                <td style="padding: 5px 0;">%s</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #666;">Số điện thoại:</td>
                <td style="padding: 5px 0;">%s</td>
              </tr>
              %s
            </table>
          </div>
          
          <p>Bạn có thể theo dõi và tra cứu chi tiết tại mục <strong>"Đơn đặt chỗ"</strong> trên trang cá nhân của mình.</p>
          <p>Nếu cần hỗ trợ thêm thông tin, quý khách vui lòng liên hệ với hotline chăm sóc khách hàng của TravelTo.</p>
          <p>Chúc quý khách có một chuyến đi thật nhiều niềm vui và ý nghĩa!</p>
          
          <div style="text-align: center; border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 20px; font-size: 12px; color: #999;">
            <p>Đây là email tự động từ hệ thống TravelTo. Vui lòng không phản hồi email này.</p>
          </div>
        </div>
        """,
        booking.getContactName() != null ? booking.getContactName() : booking.getUser().getFullName(),
        booking.getId(),
        booking.getTour().getTitle(),
        formattedDate,
        booking.getTour().getDepartureLocation(),
        booking.getGuests(),
        guestDetailsStr,
        formattedPrice,
        booking.getContactName(),
        booking.getContactPhone(),
        notesRow
    );

    emailService.sendHtmlEmail(to, subject, body);
  }

  private void restoreSeats(Booking booking) {
    TourDeparture departure = booking.getDeparture();
    if (departure != null) {
      departure.setSlotsAvailable(departure.getSlotsAvailable() + booking.getGuests());
    }

    Tour tour = booking.getTour();
    tour.setSlotsAvailable(tour.getSlotsAvailable() + booking.getGuests());
  }

  private void reserveSeats(Booking booking) {
    TourDeparture departure = booking.getDeparture();
    if (departure != null) {
      if (departure.getSlotsAvailable() < booking.getGuests()) {
        throw new BadRequestException("Không đủ chỗ trống để khôi phục booking");
      }

      departure.setSlotsAvailable(departure.getSlotsAvailable() - booking.getGuests());
    }

    Tour tour = booking.getTour();
    tour.setSlotsAvailable(Math.max(0, tour.getSlotsAvailable() - booking.getGuests()));
  }

  private BookingResponse toResponse(Booking booking) {
    return new BookingResponse(
        booking.getId(),
        booking.getTour().getId(),
        booking.getDeparture() != null ? booking.getDeparture().getId() : null,
        booking.getTour().getTitle(),
        booking.getTour().getProvinceName(),
        booking.getTravelDate(),
        booking.getGuests(),
        booking.getAdultGuests(),
        booking.getChildGuests(),
        booking.getToddlerGuests(),
        booking.getInfantGuests(),
        booking.getTotalPrice(),
        booking.getStatus().name(),
        booking.getCreatedAt(),
        booking.getUser().getEmail(),
        booking.getUser().getFullName(),
        booking.getContactName(),
        booking.getContactPhone(),
        booking.getContactNotes());
  }

  @Scheduled(fixedDelay = 300000)
  @Transactional
  public void cancelExpiredPendingBookings() {
    Instant expiryTime = Instant.now().minus(Duration.ofMinutes(15));
    List<Booking> expiredBookings = bookingRepository.findByStatusAndCreatedAtBefore(BookingStatus.PENDING, expiryTime);
    
    if (!expiredBookings.isEmpty()) {
      log.info("Found {} expired PENDING bookings. Cancelling and restoring slots...", expiredBookings.size());
          
      for (Booking booking : expiredBookings) {
        booking.setStatus(BookingStatus.CANCELLED);
        restoreSeats(booking);
      }
      bookingRepository.saveAll(expiredBookings);
    }
  }
}
