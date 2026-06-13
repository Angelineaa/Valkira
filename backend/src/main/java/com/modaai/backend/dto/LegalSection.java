package com.modaai.backend.dto;

import java.util.List;

public class LegalSection {

    private String id;
    private String title;
    private List<String> paragraphs;

    public LegalSection() {
    }

    public LegalSection(String id, String title, List<String> paragraphs) {
        this.id = id;
        this.title = title;
        this.paragraphs = paragraphs;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getParagraphs() {
        return paragraphs;
    }

    public void setParagraphs(List<String> paragraphs) {
        this.paragraphs = paragraphs;
    }
}
