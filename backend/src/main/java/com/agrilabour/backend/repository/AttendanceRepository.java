package com.agrilabour.backend.repository;

import com.agrilabour.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    List<Attendance> findByJobIdAndWorkDateOrderByLabourerProfileIdAsc(Long jobId, LocalDate workDate);

    List<Attendance> findByJobIdOrderByWorkDateDesc(Long jobId);

    List<Attendance> findByLabourerProfileIdAndWorkDateBetweenOrderByWorkDateDesc(Long labourerProfileId, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByLabourerProfileIdOrderByWorkDateDesc(Long labourerProfileId);

    Optional<Attendance> findByJobIdAndLabourerProfileIdAndWorkDate(Long jobId, Long labourerProfileId, LocalDate workDate);
}
