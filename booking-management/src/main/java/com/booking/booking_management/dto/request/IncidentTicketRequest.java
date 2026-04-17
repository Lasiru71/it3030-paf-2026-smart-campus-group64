package com.booking.booking_management.dto.request;

import com.booking.booking_management.enums.IncidentPriority;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicketRequest {
    private String resource;
    private String category;
    private String description;
    private IncidentPriority priority;
    private String contactInfo;
    private String studentId;
    private List<MultipartFile> images;
}
