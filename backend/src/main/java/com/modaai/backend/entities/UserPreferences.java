package com.modaai.backend.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_preferences")
public class UserPreferences {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "favorite_colors", length = 512)
    private String favoriteColors; // comma-separated

    @Column(name = "favorite_styles", length = 512)
    private String favoriteStyles; // comma-separated

    @Column(length = 50)
    private String bodyType;

    @Column(length = 50)
    private String preferredGender;

    @Column
    private Integer heightCm;

    @Column
    private Double weightKg;

    @Column
    private Integer bustCm;

    @Column
    private Integer waistCm;

    @Column
    private Integer hipsCm;

    @Column(name = "leg_length_cm")
    private Integer legLengthCm;

    @Column(name = "shoulder_width_cm")
    private Integer shoulderWidthCm;

    @Column(length = 20)
    private String shirtSize;

    @Column(length = 20)
    private String pantsSize;

    @Column(length = 20)
    private String shoeSize;

    @Column(length = 512)
    private String preferredCategories; // comma-separated

    public UserPreferences() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFavoriteColors() {
        return favoriteColors;
    }

    public void setFavoriteColors(String favoriteColors) {
        this.favoriteColors = favoriteColors;
    }

    public String getFavoriteStyles() {
        return favoriteStyles;
    }

    public void setFavoriteStyles(String favoriteStyles) {
        this.favoriteStyles = favoriteStyles;
    }

    public String getBodyType() {
        return bodyType;
    }

    public void setBodyType(String bodyType) {
        this.bodyType = bodyType;
    }

    public String getPreferredGender() {
        return preferredGender;
    }

    public void setPreferredGender(String preferredGender) {
        this.preferredGender = preferredGender;
    }

    public Integer getHeightCm() {
        return heightCm;
    }

    public void setHeightCm(Integer heightCm) {
        this.heightCm = heightCm;
    }

    public Double getWeightKg() {
        return weightKg;
    }

    public void setWeightKg(Double weightKg) {
        this.weightKg = weightKg;
    }

    public Integer getBustCm() {
        return bustCm;
    }

    public void setBustCm(Integer bustCm) {
        this.bustCm = bustCm;
    }

    public Integer getWaistCm() {
        return waistCm;
    }

    public void setWaistCm(Integer waistCm) {
        this.waistCm = waistCm;
    }

    public Integer getHipsCm() {
        return hipsCm;
    }

    public void setHipsCm(Integer hipsCm) {
        this.hipsCm = hipsCm;
    }

    public Integer getLegLengthCm() {
        return legLengthCm;
    }

    public void setLegLengthCm(Integer legLengthCm) {
        this.legLengthCm = legLengthCm;
    }

    public Integer getShoulderWidthCm() {
        return shoulderWidthCm;
    }

    public void setShoulderWidthCm(Integer shoulderWidthCm) {
        this.shoulderWidthCm = shoulderWidthCm;
    }

    public String getShirtSize() {
        return shirtSize;
    }

    public void setShirtSize(String shirtSize) {
        this.shirtSize = shirtSize;
    }

    public String getPantsSize() {
        return pantsSize;
    }

    public void setPantsSize(String pantsSize) {
        this.pantsSize = pantsSize;
    }

    public String getShoeSize() {
        return shoeSize;
    }

    public void setShoeSize(String shoeSize) {
        this.shoeSize = shoeSize;
    }

    public String getPreferredCategories() {
        return preferredCategories;
    }

    public void setPreferredCategories(String preferredCategories) {
        this.preferredCategories = preferredCategories;
    }
}
