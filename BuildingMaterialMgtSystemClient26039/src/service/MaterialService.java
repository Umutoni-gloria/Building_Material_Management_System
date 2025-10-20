/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;
import model.Material;

/**
 *
 * @author HP
 */
public interface MaterialService extends Remote {
    List<Material> findAll() throws RemoteException;
    int deleteMaterial(Material material) throws RemoteException;
    int addMaterial(Material material) throws RemoteException;
    Material searchMaterial(int id) throws RemoteException;
    int updateMaterial(Material material) throws RemoteException;
    
}
