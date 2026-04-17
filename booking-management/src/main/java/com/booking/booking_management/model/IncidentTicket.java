package com.booking.booking_management.model;

import com.booking.booking_management.enums.IncidentPriority;
import com.booking.booking_management.enums.IncidentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "incident_tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicket {

    @Id
    private String id;

    private String resource;

    private String category;

    private String description;

    private IncidentPriority priority;

    private String contactInfo;

    private List<String> imageUrls = new ArrayList<>();

    private String studentId;

    private IncidentStatus status;

    @CreatedDate
    private LocalDateTime createdAt;
}
