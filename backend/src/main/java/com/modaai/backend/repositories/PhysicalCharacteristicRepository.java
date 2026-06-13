package com.modaai.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.modaai.backend.entities.PhysicalCharacteristic;

public interface PhysicalCharacteristicRepository extends JpaRepository<PhysicalCharacteristic, Long> {
}