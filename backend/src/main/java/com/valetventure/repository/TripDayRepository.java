package com.valetventure.repository;

import com.valetventure.entity.TripDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TripDayRepository extends JpaRepository<TripDay, Long> {
}
