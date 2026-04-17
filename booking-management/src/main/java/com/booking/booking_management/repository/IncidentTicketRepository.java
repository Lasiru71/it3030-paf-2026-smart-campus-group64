package com.booking.booking_management.repository;

import com.booking.booking_management.model.IncidentTicket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentTicketRepository extends MongoRepository<IncidentTicket, String> {
    List<IncidentTicket> findByStudentId(String studentId);
}
