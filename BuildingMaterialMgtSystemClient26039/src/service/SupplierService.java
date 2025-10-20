/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;
import model.Supplier;

/**
 *
 * @author HP
 */
public interface SupplierService extends Remote{
    List<Supplier> findAll() throws RemoteException;
    int addSupplier(Supplier supplier) throws RemoteException;
    int deleteSupplier(Supplier supplier) throws RemoteException;
    int updateSupplier(Supplier supplier) throws RemoteException;
    Supplier searchSupplier(int id) throws RemoteException;    
    
}
