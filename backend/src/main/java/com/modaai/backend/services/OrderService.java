package com.modaai.backend.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.modaai.backend.dto.CartItemRequest;
import com.modaai.backend.dto.CartItemResponse;
import com.modaai.backend.dto.CheckoutRequest;
import com.modaai.backend.dto.OrderResponse;
import com.modaai.backend.entities.Address;
import com.modaai.backend.entities.Order;
import com.modaai.backend.entities.OrderItem;
import com.modaai.backend.entities.Product;
import com.modaai.backend.entities.User;
import com.modaai.backend.repositories.AddressRepository;
import com.modaai.backend.repositories.OrderRepository;
import com.modaai.backend.repositories.ProductRepository;

@Service
public class OrderService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final AddressRepository addressRepository;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.19");
    private static final BigDecimal SHIPPING_THRESHOLD = new BigDecimal("150000");
    private static final BigDecimal SHIPPING_COST = new BigDecimal("10000");

    public OrderService(ProductRepository productRepository, OrderRepository orderRepository,
            AddressRepository addressRepository) {
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
        this.addressRepository = addressRepository;
    }

    @Transactional
    public OrderResponse createOrder(User user, CheckoutRequest req) throws IllegalArgumentException {
        List<CartItemRequest> items = req.getItems();
        if (items == null || items.isEmpty()) {
            throw new IllegalArgumentException("No hay items en el pedido");
        }

        // Validate stock and build order items
        List<OrderItem> orderItems = items.stream().map(ci -> {
            Product p = productRepository.findById(ci.getProductId()).orElse(null);
            if (p == null) {
                throw new IllegalArgumentException("Producto no encontrado: " + ci.getProductId());
            }
            Integer ciQty = ci.getQuantity();
            int qty = ciQty == null ? 1 : ciQty;
            if (p.getStock() != null && p.getStock() < qty) {
                throw new IllegalArgumentException("Stock insuficiente para producto: " + p.getId());
            }

            OrderItem oi = new OrderItem();
            oi.setProduct(p);
            oi.setQuantity(qty);
            oi.setUnitPrice(p.getPrice());
            oi.setSize(ci.getSize());
            oi.setColor(ci.getColor());
            return oi;
        }).collect(Collectors.toList());

        // Compute totals
        BigDecimal subtotal = orderItems.stream()
                .map(oi -> oi.getUnitPrice().multiply(new BigDecimal(oi.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal shipping = subtotal.compareTo(SHIPPING_THRESHOLD) >= 0 ? BigDecimal.ZERO : SHIPPING_COST;
        BigDecimal tax = subtotal.multiply(TAX_RATE);
        BigDecimal total = subtotal.add(shipping).add(tax);

        // Persist order and decrement stock
        Order order = new Order();
        order.setUser(user);
        order.setSubtotal(subtotal);
        order.setShippingCost(shipping);
        order.setTax(tax);
        order.setTotal(total);
        order.setStatus("CREATED");

        if (req.getAddressId() != null) {
            Address a = addressRepository.findById(req.getAddressId()).orElse(null);
            order.setShippingAddress(a);
        } else if (req.getShippingAddress() != null) {
            // create address for user
            com.modaai.backend.dto.AddressRequest ar = req.getShippingAddress();
            Address a = new Address();
            a.setUser(user);
            a.setCountry(ar.getCountry());
            a.setState(ar.getState());
            a.setCity(ar.getCity());
            a.setAddressLine1(ar.getAddressLine1());
            a.setAddressLine2(ar.getAddressLine2());
            a.setPostalCode(ar.getPostalCode());
            a.setReferences(ar.getReferences());
            a.setIsDefault(Boolean.TRUE.equals(ar.getIsDefault()));
            a = addressRepository.save(a);
            order.setShippingAddress(a);
        }

        order = orderRepository.save(order);

        for (OrderItem oi : orderItems) {
            oi.setOrder(order);
            // decrement stock
            Product p = oi.getProduct();
            if (p == null) {
                p = productRepository.findById(oi.getProduct().getId()).orElse(null);
            } else {
                p = productRepository.findById(p.getId()).orElse(null);
            }
            if (p == null) {
                throw new IllegalArgumentException("Producto no encontrado en persistencia");
            }
            Integer pStock = p.getStock();
            int stockVal = pStock == null ? 0 : pStock;
            Integer oiQty = oi.getQuantity();
            int qtyVal = oiQty == null ? 0 : oiQty;
            int newStock = stockVal - qtyVal;
            p.setStock(newStock);
            productRepository.save(p);
            oi.setProduct(p);
            order.getItems().add(oi);
        }

        order = orderRepository.save(order);

        OrderResponse resp = new OrderResponse();
        resp.setOrderId(order.getId());
        resp.setStatus(order.getStatus());
        resp.setSubtotal(subtotal);
        resp.setShippingCost(shipping);
        resp.setTax(tax);
        resp.setTotal(total);
        resp.setItems(order.getItems().stream().map(oi -> {
            CartItemResponse cir = new CartItemResponse();
            cir.setProductId(oi.getProduct() != null ? oi.getProduct().getId() : null);
            cir.setQuantity(oi.getQuantity());
            cir.setUnitPrice(oi.getUnitPrice());
            cir.setSize(oi.getSize());
            cir.setColor(oi.getColor());
            if (oi.getProduct() != null) {
                cir.setName(oi.getProduct().getName());
                cir.setImageUrl(oi.getProduct().getImageUrl());
            }
            return cir;
        }).collect(Collectors.toList()));

        return resp;
    }
}
