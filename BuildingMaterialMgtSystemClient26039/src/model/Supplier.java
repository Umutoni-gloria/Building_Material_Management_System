/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.io.Serializable;
import java.util.List;

public class Supplier implements Serializable{
    private int supplier_id;
   
    private String name;
    private String email;
   
    private String address;


    
    public Supplier(int supplier_id, String name, String email, String address) {
        this.supplier_id = supplier_id;
        this.name = name;
        this.email = email;
        this.address = address;
    }

    public Supplier() {
         //To change body of generated methods, choose Tools | Templates.
    }

    public Supplier(int supplier_id) {
        this.supplier_id = supplier_id;
    }

    
    public int getSupplier_id() {
        return supplier_id;
    }

    public void setSupplier_id(int supplier_id) {
        this.supplier_id = supplier_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
    
}