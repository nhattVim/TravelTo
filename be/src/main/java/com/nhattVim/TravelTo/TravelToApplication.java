package com.nhattVim.TravelTo;

import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@ConfigurationPropertiesScan
public class TravelToApplication {

	public static void main(String[] args) {
		SpringApplication.run(TravelToApplication.class, args);
	}

}
