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
@Table(name = "preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "favorite_style")
    private String favoriteStyle;

    @Column(name = "favorite_colors", columnDefinition = "json")
    private String favoriteColors;

    @Column(name = "favorite_brands", columnDefinition = "json")
    private String favoriteBrands;

    @Column(name = "favorite_categories", columnDefinition = "json")
    private String favoriteCategories;
}