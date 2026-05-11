package com.voltx.repository;

import com.voltx.model.Customer;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public class CustomerRepository {
    private List<Customer> customers = new java.util.ArrayList<>();
    private long nextId = 1;

    public Customer save(Customer customer) {
        if (customer.getId() == null) {
            customer.setId(nextId++);
        }
        customers.removeIf(c -> c.getId().equals(customer.getId()));
        customers.add(customer);
        return customer;
    }

    public List<Customer> findAll() {
        return new java.util.ArrayList<>(customers);
    }

    public Optional<Customer> findById(Long id) {
        return customers.stream().filter(c -> c.getId().equals(id)).findFirst();
    }

    public List<Customer> findByBranchId(Long branchId) {
        return customers.stream()
                .filter(c -> c.getBranchId().equals(branchId))
                .toList();
    }

    public void deleteById(Long id) {
        customers.removeIf(c -> c.getId().equals(id));
    }
}
