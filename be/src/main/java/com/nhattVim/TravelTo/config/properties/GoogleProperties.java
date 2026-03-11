package com.nhattVim.TravelTo.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.google")
public record GoogleProperties(String tokenInfoUrl) {
}
