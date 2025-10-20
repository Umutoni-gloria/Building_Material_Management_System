package dao;

import model.SignUpModel;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.Query;
import Util.HibernateUtil;

public class UserDao {

    public boolean registerUser(SignUpModel user) {
        Transaction tx = null;
        try  {
            Session session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();
            session.save(user);
            tx.commit();
            return true;
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
            return false;
        }
    }

    
    public SignUpModel loginUser(String username, String password) {
        try { 
            Session session = HibernateUtil.getSessionFactory().openSession();
            String hql = "FROM SignUpModel WHERE email = :uname AND password = :pwd";
            Query query;
            query = session.createQuery(hql);
            query.setParameter("uname", username);
            query.setParameter("pwd", password);
            return (SignUpModel) query.uniqueResult();
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
