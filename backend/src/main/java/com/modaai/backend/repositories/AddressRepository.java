package com.modaai.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.modaai.backend.entities.Address;
import com.modaai.backend.entities.User;

public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user);
}
