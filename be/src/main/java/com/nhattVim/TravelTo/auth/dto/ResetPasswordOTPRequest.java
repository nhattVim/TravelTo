package com.nhattVim.TravelTo.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ResetPasswordOTPRequest(
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    String email,

    @NotBlank(message = "OTP không được để trống")
    String otp,

    @NotBlank(message = "Mật khẩu mới không được để trống")
    String newPassword
) {}
