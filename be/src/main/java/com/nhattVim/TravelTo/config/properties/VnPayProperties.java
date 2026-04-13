package com.nhattVim.TravelTo.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.vnpay")
public record VnPayProperties(
    String version,
    String command,
    String tmnCode,
    String hashSecret,
    String payUrl,
    String returnUrl
) {
}
