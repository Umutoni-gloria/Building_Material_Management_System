/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;
import model.Sale;

/**
 *
 * @author HP
 */
public interface SaleService extends Remote {
    List<Sale> findAll() throws RemoteException;
    int addSale(Sale sale) throws RemoteException;
    Sale searchSale(int id) throws RemoteException;
    int updateSale(Sale sale) throws RemoteException;
    int deleteSale(Sale sale) throws RemoteException;
    
}
