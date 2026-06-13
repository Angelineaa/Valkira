package com.modaai.backend.dto;

import java.util.List;

public class UserPreferencesResponse {

    private Long id;
    private List<String> favoriteColors;
    private List<String> favoriteStyles;
    private String bodyType;
    private String preferredGender;
    private Integer heightCm;
    private Double weightKg;
    private Integer bustCm;
    private Integer waistCm;
    private Integer hipsCm;
    private Integer legLengthCm;
    private Integer shoulderWidthCm;
    private String shirtSize;
    private String pantsSize;
    private String shoeSize;
    private List<String> preferredCategories;

    public UserPreferencesResponse() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getFavoriteColors() {
        return favoriteColors;
    }

    public void setFavoriteColors(List<String> favoriteColors) {
        this.favoriteColors = favoriteColors;
    }

    public List<String> getFavoriteStyles() {
        return favoriteStyles;
    }

    public void setFavoriteStyles(List<String> favoriteStyles) {
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

    public List<String> getPreferredCategories() {
        return preferredCategories;
    }

    public void setPreferredCategories(List<String> preferredCategories) {
        this.preferredCategories = preferredCategories;
    }
}
