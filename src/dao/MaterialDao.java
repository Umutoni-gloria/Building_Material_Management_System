package dao;

import model.Material;
import org.hibernate.Session;
import org.hibernate.Transaction;
import Util.HibernateUtil;

import java.util.List;

public class MaterialDao {

    // INSERT MATERIAL
    public int insertMaterial(Material materialsObj) {
        Transaction tx = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();
            session.save(materialsObj);
            tx.commit();
            return 1;
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // UPDATE MATERIAL
    public int updateMaterial(Material materialsObj) {
        Transaction tx = null;
        try { 
            Session session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();
            session.update(materialsObj);
            tx.commit();
            return 1;
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // DELETE MATERIAL
    public int deleteMaterialRecord(Material materialsObj) {
        Transaction tx = null;
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();
            session.delete(materialsObj);
            tx.commit();
            return 1;
        } catch (Exception ex) {
            if (tx != null) tx.rollback();
            ex.printStackTrace();
            return 0;
        }
    }

    // SEARCH MATERIAL BY ID
    public Material findMaterialById(int materialId) {
        try {
            Session session = HibernateUtil.getSessionFactory().openSession();
            return (Material) session.get(Material.class, materialId);
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    // FETCH ALL MATERIALS
    @SuppressWarnings("unchecked")
    public List<Material> findAllMaterials() {
        try {Session session = HibernateUtil.getSessionFactory().openSession();
            return session.createQuery("FROM Material").list();
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
