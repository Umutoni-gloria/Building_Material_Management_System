/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package implementation;

import Dao.SaleDao;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;
import model.Sale;
import service.SaleService;

public class SaleImplementation extends UnicastRemoteObject implements SaleService{

    public SaleImplementation() throws RemoteException {
    }
    
    SaleDao dao = new SaleDao();

    
    @Override
    public List<Sale> findAll() throws RemoteException {
     return dao.findAllSales();
    }

    @Override
    public int addSale(Sale sale) throws RemoteException {
       return dao.insertSale(sale);
    }

    @Override
    public Sale searchSale(int id) throws RemoteException {
       return dao.findSaleById(id);
    }

    @Override
    public int updateSale(Sale sale) throws RemoteException {
        return dao.updateSale(sale);
    }

    @Override
    public int deleteSale(Sale sale) throws RemoteException {
       return dao.deleteSaleRecord(sale);
    }
    
    
}
