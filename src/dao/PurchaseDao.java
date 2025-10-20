package Dao;

import model.Purchase;
import org.hibernate.Session;
import org.hibernate.Transaction;
import Util.HibernateUtil;

import java.util.List;

public class PurchaseDao {

    // ✅ INSERT
    public int insertPurchase(Purchase purchase) {
        Transaction transaction = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            session.save(purchase);
            transaction.commit();
            return 1;
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            return 0;
        }
    }

    // ✅ UPDATE
    public int updatePurchase(Purchase purchase) {
        Transaction transaction = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            session.update(purchase);
            transaction.commit();
            return 1;
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            return 0;
        }
    }

    // ✅ DELETE
    public int deletePurchaseRecord(Purchase purchase) {
        Transaction transaction = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            session.delete(purchase);
            transaction.commit();
            return 1;
        } catch (Exception e) {
            if (transaction != null) transaction.rollback();
            e.printStackTrace();
            return 0;
        }
    }

    // ✅ FIND BY ID
    public Purchase findPurchaseById(int purchaseId) {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            return (Purchase) session.get(Purchase.class, purchaseId);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // ✅ FETCH ALL
    public List<Purchase> findAllPurchases() {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            return session.createQuery("FROM Purchase").list();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
