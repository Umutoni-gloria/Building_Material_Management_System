/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package implementation;

import dao.MaterialDao;
import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.List;
import model.Material;
import service.MaterialService;

/**
 *
 * @author HP
 */
public class MaterialImplementation extends UnicastRemoteObject implements MaterialService{

    public MaterialImplementation() throws RemoteException {
    }

    MaterialDao dao = new MaterialDao();
    
    @Override
    public List<Material> findAll() throws RemoteException {
        return dao.findAllMaterials();
     }

    
    @Override
    public int deleteMaterial(Material material) throws RemoteException {
        return dao.deleteMaterialRecord(material);
    }

    @Override
    public int addMaterial(Material material) throws RemoteException {
       return dao.insertMaterial(material);
    }

    @Override
    public Material searchMaterial(int id) throws RemoteException {
        return dao.findMaterialById(id);
    }

    @Override
    public int updateMaterial(Material material) throws RemoteException {
        return dao.updateMaterial(material);
    }
    
}
