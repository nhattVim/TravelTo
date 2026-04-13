package com.nhattVim.TravelTo.payment.controller;

import com.nhattVim.TravelTo.booking.dto.BookingCreateRequest;
import com.nhattVim.TravelTo.booking.entity.Booking;
import com.nhattVim.TravelTo.booking.entity.BookingStatus;
import com.nhattVim.TravelTo.booking.repository.BookingRepository;
import com.nhattVim.TravelTo.booking.service.BookingService;
import com.nhattVim.TravelTo.common.exception.BadRequestException;
import com.nhattVim.TravelTo.payment.dto.PaymentUrlResponse;
import com.nhattVim.TravelTo.payment.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {

  private final PaymentService paymentService;
  private final BookingService bookingService;
  private final BookingRepository bookingRepository;

  @Value("${app.cors.allowed-origins[0]}")
  private String feOrigin;

  public PaymentController(PaymentService paymentService, BookingService bookingService,
      BookingRepository bookingRepository) {
    this.paymentService = paymentService;
    this.bookingService = bookingService;
    this.bookingRepository = bookingRepository;
  }

  @PostMapping("/vnpay/submit-order")
  public ResponseEntity<PaymentUrlResponse> submitOrder(@Valid @RequestBody BookingCreateRequest request,
      Principal principal, HttpServletRequest httpRequest) {
    // 1. Create PENDING Booking
    var bookingResponse = bookingService.createBooking(principal.getName(), request);
    Booking booking = bookingRepository.findById(bookingResponse.id())
        .orElseThrow(() -> new BadRequestException("Lỗi tạo booking"));

    // 2. Generate VNPay URL
    String ipAddress = getClientIp(httpRequest);
    String paymentUrl = paymentService.createPaymentUrl(booking, ipAddress);

    return ResponseEntity.ok(new PaymentUrlResponse(paymentUrl));
  }

  @GetMapping("/vnpay/return")
  public void vnpayReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
    boolean isValidSignature = paymentService.verifySignature(params);
    
    if (!isValidSignature) {
      response.sendRedirect(feOrigin + "/payment/result?status=failed&reason=invalid_signature");
      return;
    }

    String responseCode = params.get("vnp_ResponseCode");
    String txnRef = params.get("vnp_TxnRef");

    Booking booking = bookingRepository.findById(Long.parseLong(txnRef)).orElse(null);
    if (booking == null) {
      response.sendRedirect(feOrigin + "/payment/result?status=failed&reason=order_not_found");
      return;
    }

    if ("00".equals(responseCode)) {
      // Payment success
      bookingService.updateStatus(booking.getId(), BookingStatus.CONFIRMED);
      response.sendRedirect(feOrigin + "/payment/result?status=success&bookingId=" + booking.getId());
    } else {
      // Payment failed
      bookingService.updateStatus(booking.getId(), BookingStatus.CANCELLED);
      response.sendRedirect(feOrigin + "/payment/result?status=failed&reason=payment_failed");
    }
  }

  private String getClientIp(HttpServletRequest request) {
    String remoteAddr = "";
    if (request != null) {
      remoteAddr = request.getHeader("X-FORWARDED-FOR");
      if (remoteAddr == null || remoteAddr.isBlank()) {
        remoteAddr = request.getRemoteAddr();
      }
    }
    return remoteAddr;
  }
}
