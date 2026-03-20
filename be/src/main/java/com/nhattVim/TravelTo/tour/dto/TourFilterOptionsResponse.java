package com.nhattVim.TravelTo.tour.dto;

import java.util.List;

public record TourFilterOptionsResponse(List<String> departureLocations, List<String> destinationLocations) {
}
