package com.nhattVim.TravelTo.common.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

  private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
  private final JavaMailSender javaMailSender;

  public EmailService(JavaMailSender javaMailSender) {
    this.javaMailSender = javaMailSender;
  }

  @Async
  public void sendSimpleMessage(String to, String subject, String text) {
    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setTo(to);
      message.setSubject(subject);
      message.setText(text);
      javaMailSender.send(message);
      logger.info("Sent email to {}", to);
    } catch (Exception e) {
      logger.error("Failed to send email to {}", to, e);
    }
  }

  public void sendPasswordResetCode(String email, String code) {
    String text = "Lưu ý không chia sẻ mã này cho bất kỳ ai.\n"
        + "Mã OTP để khôi phục mật khẩu tài khoản TravelTo của bạn là: " + code + "\n"
        + "Mã này sẽ hết hạn trong 10 phút.";
    sendSimpleMessage(email, "Mã xác thực đổi mật khẩu - TravelTo", text);
  }
}
