/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package implementation;

import Dao.PurchaseDao;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;
import model.Purchase;
import service.PurchaseService;

/**
 *
 * @author HP
 */
public class PurchaseImplementation extends UnicastRemoteObject implements PurchaseService{

    public PurchaseImplementation() throws RemoteException {
    }
    
    PurchaseDao dao = new PurchaseDao();

    @Override
    public List<Purchase> findAll() throws RemoteException {
        return dao.findAllPurchases();
    }

    @Override
    public int addPurchase(Purchase purchase) throws RemoteException {
       return dao.insertPurchase(purchase);
    }

    @Override
    public Purchase searchPurchase(int id) throws RemoteException {
        return dao.findPurchaseById(id);
    }

    @Override
    public int deletePurchase(Purchase purchase) throws RemoteException {
       return dao.deletePurchaseRecord(purchase);
    }

    @Override
    public int updatePurchase(Purchase purchase) throws RemoteException {
        return dao.updatePurchase(purchase);
    }
    
}
