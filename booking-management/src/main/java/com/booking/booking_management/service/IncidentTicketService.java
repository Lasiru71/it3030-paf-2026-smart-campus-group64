package com.booking.booking_management.service;

import com.booking.booking_management.dto.request.IncidentTicketRequest;
import com.booking.booking_management.enums.IncidentStatus;
import com.booking.booking_management.model.IncidentTicket;
import com.booking.booking_management.repository.IncidentTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class IncidentTicketService {

    private final IncidentTicketRepository repository;
    private final String uploadDir = "uploads/incidents";

    @Autowired
    public IncidentTicketService(IncidentTicketRepository repository) {
        this.repository = repository;
        try {
            Files.createDirectories(Paths.get(uploadDir));
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public IncidentTicket createTicket(IncidentTicketRequest request) {
        List<String> imageUrls = new ArrayList<>();
        
        if (request.getImages() != null) {
            for (MultipartFile file : request.getImages()) {
                if (file != null && !file.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path targetPath = Paths.get(uploadDir).resolve(fileName);
                    try {
                        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
                        imageUrls.add("/api/incidents/images/" + fileName);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to store file: " + file.getOriginalFilename(), e);
                    }
                }
            }
        }

        IncidentTicket ticket = IncidentTicket.builder()
                .resource(request.getResource())
                .category(request.getCategory())
                .description(request.getDescription())
                .priority(request.getPriority())
                .contactInfo(request.getContactInfo())
                .studentId(request.getStudentId())
                .imageUrls(imageUrls)
                .status(IncidentStatus.OPEN)
                .build();

        return repository.save(ticket);
    }

    public List<IncidentTicket> getStudentTickets(String studentId) {
        return repository.findByStudentId(studentId);
    }
}
