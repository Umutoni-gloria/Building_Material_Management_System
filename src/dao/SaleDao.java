package Dao;

import Util.HibernateUtil;
import model.Sale;
import org.hibernate.Session;
import org.hibernate.Transaction;


import java.util.List;
import org.hibernate.Query;

public class SaleDao {

    // ✅ INSERT SALE
    public int insertSale(Sale sale) {
        Transaction transaction = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            session.save(sale);
            transaction.commit();
            return 1;
        } catch (Exception ex) {
            if (transaction != null) transaction.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // ✅ UPDATE SALE
    public int updateSale(Sale sale) {
        Transaction transaction = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            session.update(sale);
            transaction.commit();
            return 1;
        } catch (Exception ex) {
            if (transaction != null) transaction.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // ✅ DELETE SALE
    public int deleteSaleRecord(Sale sale) {
        Transaction transaction = null;
        try{
            Session session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();
            session.delete(sale);
            transaction.commit();
            return 1;
        } catch (Exception ex) {
            if (transaction != null) transaction.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // ✅ FIND SALE BY ID
    public Sale findSaleById(int saleId) {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            return (Sale) session.get(Sale.class, saleId);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    // ✅ FIND ALL SALES
    public List<Sale> findAllSales() {
        try { Session session = HibernateUtil.getSessionFactory().openSession();
            return session.createQuery("FROM Sale").list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
