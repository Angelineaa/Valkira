package com.modaai.backend.dto;

import java.util.List;

public class CheckoutRequest {

    private Long addressId; // optional: use existing address
    private AddressRequest shippingAddress; // optional: provide new address
    private String paymentMethod; // e.g., CARD, BANK_TRANSFER, CASH_ON_DELIVERY
    private List<CartItemRequest> items; // optional: override cart items

    public Long getAddressId() {
        return addressId;
    }

    public void setAddressId(Long addressId) {
        this.addressId = addressId;
    }

    public AddressRequest getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(AddressRequest shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public List<CartItemRequest> getItems() {
        return items;
    }

    public void setItems(List<CartItemRequest> items) {
        this.items = items;
    }
}
