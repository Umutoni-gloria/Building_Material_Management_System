/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;
import model.Purchase;

/**
 *
 * @author HP
 */
public interface PurchaseService extends Remote {
    List<Purchase> findAll() throws RemoteException;
    int addPurchase(Purchase purchase) throws RemoteException;
    Purchase searchPurchase(int id) throws RemoteException;
    int deletePurchase(Purchase purchase) throws RemoteException;
    int updatePurchase(Purchase purchase) throws RemoteException;
}
