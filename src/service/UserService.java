/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package service;

import java.rmi.Remote;
import java.rmi.RemoteException;
import model.SignUpModel;

/**
 *
 * @author user2
 */
public interface UserService extends Remote{
    
    boolean signUp(SignUpModel theUser) throws RemoteException;
    String sendVerificationEmail(String email) throws RemoteException;
    boolean verifyCode(String email, String code) throws RemoteException;
    SignUpModel signIn (String username, String password) throws RemoteException;  
    
    
}
