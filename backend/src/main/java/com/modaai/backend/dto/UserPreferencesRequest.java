package com.modaai.backend.dto;

import java.util.List;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public class UserPreferencesRequest {

    private List<String> favoriteColors;
    private List<String> favoriteStyles;

    @Size(max = 50)
    private String bodyType;

    @Size(max = 50)
    private String preferredGender;

    @Positive(message = "heightCm debe ser mayor que 0")
    @Max(value = 300, message = "heightCm debe ser menor o igual a 300")
    private Integer heightCm;

    @Positive(message = "weightKg debe ser mayor que 0")
    @Max(value = 500, message = "weightKg debe ser menor o igual a 500")
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

    public UserPreferencesRequest() {
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
