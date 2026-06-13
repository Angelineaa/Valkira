package com.modaai.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.modaai.backend.entities.Preference;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {
}