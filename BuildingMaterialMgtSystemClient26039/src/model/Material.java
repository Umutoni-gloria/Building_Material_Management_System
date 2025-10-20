/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package model;

import java.io.Serializable;
import java.util.List;

public class Material implements Serializable {
    private int material_id;
    
    private String name;
    private String category;
    private int quantity;
    private Double unitPrice;
    
    
    public Material() {
        
    }

    public Material(int material_id) {
        this.material_id = material_id;
    } 
    
    public Material(int material_id, String name, String category, int quantity, double unitPrice) {
        this.material_id = material_id;
        this.name = name;
        this.category = category;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }
    
    @Override
public String toString() {
    return material_id + " - " + name;
}

    
    
    

    public int getMaterial_id() {
        return material_id;
    }

    public void setMaterial_id(int material_id) {
        this.material_id = material_id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getMaterial_name() {
         return name;
    }
    
    
    
}