/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 *
 * @author user2
 */
@Entity
@Table(name = "sale")
public class Sale implements Serializable {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    @Column (name = "sale_id")
     private int sale_id;
    @Column (name = "material_id")
    private int material_id;
    @Column (name = "customer_name")
    private String customer_name;
    @Column (name = "quantity")
    private int quantity;
    @Column (name = "total_price")
    private int total_price;
    @Column (name = "sale_date")
    private LocalDate sale_date;



    public Sale(int sale_id, int material_id, String customer_name, int quantity, int total_price, LocalDate sale_date) {
        this.sale_id = sale_id;
        this.material_id = material_id;
        this.customer_name = customer_name;
        this.quantity = quantity;
        this.total_price = total_price;
        this.sale_date = sale_date;
    }

    public Sale(int sale_id) {
        this.sale_id = sale_id;
    }  

    public Sale() {
         //To change body of generated methods, choose Tools | Templates.
    }

    public int getSale_id() {
        return sale_id;
    }

    public void setSale_id(int sale_id) {
        this.sale_id = sale_id;
    }

    public String getCustomer_name() {
        return customer_name;
    }

    public void setCustomer_name(String customer_name) {
        this.customer_name = customer_name;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getTotal_price() {
        return total_price;
    }

    public void setTotal_price(int total_price) {
        this.total_price = total_price;
    }

    public LocalDate getSale_date() {
        return sale_date;
    }

    public void setSale_date(LocalDate sale_date) {
        this.sale_date = sale_date;
    }

    public int getMaterial_id() {
        return material_id;
    }

    public void setMaterial_id(int material_id) {
        this.material_id = material_id;
    }

   
    
    
    
}