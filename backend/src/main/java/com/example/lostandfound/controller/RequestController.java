package com.example.lostandfound.controller;

import com.example.lostandfound.entity.Request;
import com.example.lostandfound.entity.RequestStatus;
import com.example.lostandfound.entity.User;
import com.example.lostandfound.service.RequestService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for claim Request management.
 *
 * Endpoint summary:
 *  GET    /api/requests              – List all requests          (ADMIN, STAFF)
 *  GET    /api/requests/my           – List my requests           (any authenticated user)
 *  GET    /api/requests/{id}         – Get request by ID          (ADMIN, STAFF)
 *  POST   /api/requests/item/{id}    – Submit a claim request     (any authenticated user)
 *  PUT    /api/requests/{id}/status  – Approve / Reject           (ADMIN, STAFF)
 *  DELETE /api/requests/{id}         – Delete a request           (ADMIN, STAFF)
 */
@RestController
@RequestMapping("/api/requests")
public class RequestController {

    private static final Logger logger = LoggerFactory.getLogger(RequestController.class);

    @Autowired
    private RequestService requestService;

    // -------------------------------------------------------------------------
    // GET /api/requests  –  All requests (staff / admin view)
    // -------------------------------------------------------------------------
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public List<Request> getAllRequests() {
        logger.info("GET /api/requests – listing all requests");
        return requestService.getAllRequests();
    }

    // -------------------------------------------------------------------------
    // GET /api/requests/my  –  Requests submitted by the current user
    // -------------------------------------------------------------------------
    @GetMapping("/my")
    public ResponseEntity<List<Request>> getMyRequests(Authentication authentication) {
        logger.info("GET /api/requests/my – for user '{}'", authentication.getName());
        User currentUser = (User) authentication.getPrincipal();
        List<Request> myRequests = requestService.getRequestsByUser(currentUser.getId());
        return ResponseEntity.ok(myRequests);
    }

    // -------------------------------------------------------------------------
    // GET /api/requests/{id}
    // -------------------------------------------------------------------------
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Request> getRequestById(@PathVariable Long id) {
        logger.info("GET /api/requests/{}", id);
        return requestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // -------------------------------------------------------------------------
    // POST /api/requests/item/{itemId}  –  Submit a claim request
    // -------------------------------------------------------------------------
    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody Request requestData, Authentication authentication) {
        logger.info("POST /api/requests submitted by '{}'", authentication.getName());
        Request request = requestService.createRequest(requestData, authentication.getName());
        return ResponseEntity.ok(request);
    }

    // -------------------------------------------------------------------------
    // PUT /api/requests/{id}/status?status=APPROVED|REJECTED
    // -------------------------------------------------------------------------
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<Request> updateRequestStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> body) {
        RequestStatus status = RequestStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(requestService.updateRequestStatus(id, status));
    }

    // -------------------------------------------------------------------------
    // DELETE /api/requests/{id}
    // -------------------------------------------------------------------------
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        logger.info("DELETE /api/requests/{}", id);
        requestService.deleteRequest(id);
        return ResponseEntity.ok("Request deleted successfully.");
    }
}
