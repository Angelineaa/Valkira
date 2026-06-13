package com.modaai.backend.dto;

import java.util.List;

public class LegalResponse {

    private String title;
    private List<LegalSection> sections;

    public LegalResponse() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<LegalSection> getSections() {
        return sections;
    }

    public void setSections(List<LegalSection> sections) {
        this.sections = sections;
    }
}
