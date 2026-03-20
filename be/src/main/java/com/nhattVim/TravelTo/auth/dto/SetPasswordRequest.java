package com.nhattVim.TravelTo.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SetPasswordRequest(
    @NotBlank(message = "Mật khẩu không được để trống") @Size(min = 8, max = 72, message = "Mật khẩu phải từ 8 đến 72 ký tự") String password) {
}
