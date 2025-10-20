package dao;

import model.Supplier;
import org.hibernate.Session;
import org.hibernate.Transaction;
import Util.HibernateUtil;

import java.util.List;

public class SupplierDao {

    
    public int insertSupplier(Supplier supplierObj) {
        Transaction tx = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();
            session.save(supplierObj);
            tx.commit();
            return 1;
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // UPDATE SUPPLIER
    public int updateSupplier(Supplier supplierObj) {
        Transaction tx = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();
            session.update(supplierObj);
            tx.commit();
            return 1;
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // DELETE SUPPLIER
    public int deleteSupplier(Supplier supplierObj) {
        Transaction tx = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();
            session.delete(supplierObj);
            tx.commit();
            return 1;
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // FIND SUPPLIER BY ID
    public Supplier findSupplierById(int supplierId) {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            return (Supplier) session.get(Supplier.class, supplierId);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    // FETCH ALL SUPPLIERS
    @SuppressWarnings("unchecked")
    public List<Supplier> findAllSuppliers() {
        try { Session session = HibernateUtil.getSessionFactory().openSession();
            return session.createQuery("FROM Supplier").list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
