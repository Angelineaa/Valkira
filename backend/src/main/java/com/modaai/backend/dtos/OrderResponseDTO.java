package com.modaai.backend.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {

    private Long id;
    private BigDecimal subtotal;
    private BigDecimal shippingCost;
    private BigDecimal tax;
    private BigDecimal total;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> items;
    private ShippingAddressDTO shippingAddress;

    public OrderResponseDTO() {
    }

    public OrderResponseDTO(Long id, BigDecimal subtotal, BigDecimal shippingCost, BigDecimal tax,
            BigDecimal total, String status, LocalDateTime createdAt,
            List<OrderItemDTO> items, ShippingAddressDTO shippingAddress) {
        this.id = id;
        this.subtotal = subtotal;
        this.shippingCost = shippingCost;
        this.tax = tax;
        this.total = total;
        this.status = status;
        this.createdAt = createdAt;
        this.items = items;
        this.shippingAddress = shippingAddress;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getShippingCost() {
        return shippingCost;
    }

    public void setShippingCost(BigDecimal shippingCost) {
        this.shippingCost = shippingCost;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public ShippingAddressDTO getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(ShippingAddressDTO shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public static class OrderItemDTO {

        private Long id;
        private String size;
        private String color;
        private Integer quantity;
        private BigDecimal unitPrice;

        public OrderItemDTO() {
        }

        public OrderItemDTO(Long id, String size, String color, Integer quantity, BigDecimal unitPrice) {
            this.id = id;
            this.size = size;
            this.color = color;
            this.quantity = quantity;
            this.unitPrice = unitPrice;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getSize() {
            return size;
        }

        public void setSize(String size) {
            this.size = size;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public BigDecimal getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(BigDecimal unitPrice) {
            this.unitPrice = unitPrice;
        }
    }

    public static class ShippingAddressDTO {

        private Long id;
        private String country;
        private String state;
        private String city;
        private String addressLine1;
        private String addressLine2;
        private String postalCode;
        private String references;

        public ShippingAddressDTO() {
        }

        public ShippingAddressDTO(Long id, String country, String state, String city,
                String addressLine1, String addressLine2, String postalCode, String references) {
            this.id = id;
            this.country = country;
            this.state = state;
            this.city = city;
            this.addressLine1 = addressLine1;
            this.addressLine2 = addressLine2;
            this.postalCode = postalCode;
            this.references = references;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getAddressLine1() {
            return addressLine1;
        }

        public void setAddressLine1(String addressLine1) {
            this.addressLine1 = addressLine1;
        }

        public String getAddressLine2() {
            return addressLine2;
        }

        public void setAddressLine2(String addressLine2) {
            this.addressLine2 = addressLine2;
        }

        public String getPostalCode() {
            return postalCode;
        }

        public void setPostalCode(String postalCode) {
            this.postalCode = postalCode;
        }

        public String getReferences() {
            return references;
        }

        public void setReferences(String references) {
            this.references = references;
        }
    }
}
