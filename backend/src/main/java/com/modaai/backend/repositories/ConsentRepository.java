package com.modaai.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.modaai.backend.entities.Consent;

public interface ConsentRepository extends JpaRepository<Consent, Long> {
}