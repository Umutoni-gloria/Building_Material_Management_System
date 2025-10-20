/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.io.Serializable;
import java.time.LocalDate;

public class Purchase implements Serializable {
    private int  purchase_id;
    private int supplier_id;
    private int material_id;
    private int quantity;
    private double total_price;
    private LocalDate purchase_date;
    

    public Purchase(int purchase_id, int supplier_id, int material_id, int quantity, double total_price, LocalDate purchase_date) {
        this.purchase_id = purchase_id;
        this.supplier_id = supplier_id;
        this.material_id = material_id;
        this.quantity = quantity;
        this.total_price = total_price;
        this.purchase_date = purchase_date;
    }

    public Purchase() {
        //To change body of generated methods, choose Tools | Templates.
    }

    public Purchase(int purchase_id) {
        this.purchase_id = purchase_id;
    }

    
    public int getPurchase_id() {
        return purchase_id;
    }

    public void setPurchase_id(int purchase_id) {
        this.purchase_id = purchase_id;
    }

    public int getSupplier_id() {
        return supplier_id;
    }

    public void setSupplier_id(int supplier_id) {
        this.supplier_id = supplier_id;
    }

    public int getMaterial_id() {
        return material_id;
    }

    public void setMaterial_id(int material_id) {
        this.material_id = material_id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotal_price() {
        return total_price;
    }

    public void setTotal_price(double total_price) {
        this.total_price = total_price;
    }

    public LocalDate getPurchase_date() {
        return purchase_date;
    }

    public void setPurchase_date(LocalDate purchase_date) {
        this.purchase_date = purchase_date;
    }

  

     
    
 }