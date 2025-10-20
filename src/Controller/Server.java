/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package Controller;

import implementation.MaterialImplementation;
import implementation.PurchaseImplementation;
import implementation.SaleImplementation;
import implementation.SupplierImplementation;
import implementation.UserImplementation;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

/**
 *
 * @author user2
 */
public class Server {
    public static void main(String[] args) {
        try{
            System.setProperty("java.rmi.server.hostname", "127.0.0.4");
            Registry theRegistry = LocateRegistry.createRegistry(6000);
            theRegistry.rebind("saved", new UserImplementation());
            theRegistry.rebind("material", new MaterialImplementation());
            theRegistry.rebind("supplier", new SupplierImplementation());
            theRegistry.rebind("sale", new SaleImplementation());
            theRegistry.rebind("purchase", new PurchaseImplementation());
            System.out.println("Server is running on port 6000");
                   
        } catch (Exception ex){
            ex.printStackTrace();
        }
    }
    
}
