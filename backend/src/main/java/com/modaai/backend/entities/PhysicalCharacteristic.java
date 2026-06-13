package com.modaai.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "physical_characteristics")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PhysicalCharacteristic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "height_cm")
    private Double heightCm;

    @Column(name = "weight_kg")
    private Double weightKg;

    @Column(name = "body_type")
    private String bodyType;

    @Column(name = "shirt_size")
    private String shirtSize;

    @Column(name = "pants_size")
    private String pantsSize;

    @Column(name = "shoe_size")
    private String shoeSize;
}