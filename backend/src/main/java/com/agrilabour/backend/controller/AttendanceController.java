package com.agrilabour.backend.controller;

import com.agrilabour.backend.dto.AttendanceRequest;
import com.agrilabour.backend.dto.AttendanceResponse;
import com.agrilabour.backend.dto.WageSummaryResponse;
import com.agrilabour.backend.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    // Log or update daily attendance for a worker
    @PostMapping("/farmer/{farmerUserId}")
    public ResponseEntity<AttendanceResponse> logAttendance(
            @PathVariable Long farmerUserId,
            @Valid @RequestBody AttendanceRequest request
    ) {
        return ResponseEntity.ok(attendanceService.logAttendance(farmerUserId, request));
    }

    // Farmer views attendance for a specific job on a specific date
    @GetMapping("/farmer/{farmerUserId}/job/{jobId}")
    public ResponseEntity<List<AttendanceResponse>> getAttendanceByJobAndDate(
            @PathVariable Long farmerUserId,
            @PathVariable Long jobId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(attendanceService.getAttendanceByJobAndDate(farmerUserId, jobId, date));
    }

    // Farmer views total wage calculation report for a specific job
    @GetMapping("/farmer/{farmerUserId}/job/{jobId}/summary")
    public ResponseEntity<WageSummaryResponse> getJobWageSummary(
            @PathVariable Long farmerUserId,
            @PathVariable Long jobId
    ) {
        return ResponseEntity.ok(attendanceService.getJobWageSummary(farmerUserId, jobId));
    }

    // Labourer views their total earnings & attendance summary report
    @GetMapping("/labourer/{labourerUserId}/summary")
    public ResponseEntity<WageSummaryResponse> getLabourerWageSummary(
            @PathVariable Long labourerUserId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        return ResponseEntity.ok(attendanceService.getLabourerWageSummary(labourerUserId, startDate, endDate));
    }
}
