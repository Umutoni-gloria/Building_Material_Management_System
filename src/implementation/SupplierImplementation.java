/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package implementation;

import dao.SupplierDao;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;
import model.Supplier;
import service.SupplierService;

/**
 *
 * @author HP
 */
public class SupplierImplementation extends UnicastRemoteObject implements SupplierService{

    public SupplierImplementation() throws RemoteException {
    }
    
    SupplierDao dao = new SupplierDao();

    @Override
    public List<Supplier> findAll() throws RemoteException {
       return dao.findAllSuppliers();
    }

    @Override
    public int addSupplier(Supplier supplier) throws RemoteException {
        return dao.insertSupplier(supplier);
    }

    @Override
    public int deleteSupplier(Supplier supplier) throws RemoteException {
        return dao.deleteSupplier(supplier);
    }

    @Override
    public int updateSupplier(Supplier supplier) throws RemoteException {
        return dao.updateSupplier(supplier);
    }

    @Override
    public Supplier searchSupplier(int id) throws RemoteException {
        return dao.findSupplierById(id);
    }
    
}
