package com.nhattVim.TravelTo.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailPasswordLoginRequest(
    @NotBlank(message = "Email không được để trống") @Email(message = "Email không hợp lệ") String email,
    @NotBlank(message = "Mật khẩu không được để trống") String password) {
}
