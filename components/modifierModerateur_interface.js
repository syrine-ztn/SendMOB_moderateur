import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from '../styles/modifierModerateur_interface.module.css';
import { useRouter } from 'next/router';

const ModifierModerateurInterface = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [formData, setFormData] = useState({
    nom_mod: '',
    prenom_mod: '',
    numero_telephone_mod: '',
    email: '',
    client_id: '',
  });

  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchModerateur = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/moderateurs/getModerateurById/${userId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        setFormData(response.data); // Mettre à jour le state avec les données récupérées du modérateur
      } catch (error) {
        console.error('Erreur lors de la récupération du modérateur :', error);
      }
    };

    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/clients/getAllClients', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des clients :', error);
      }
    };

    if (userId) {
      fetchModerateur();
      fetchClients();
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/moderateurs/updateModerateur/${userId}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log('Modérateur mis à jour :', response.data);
      router.push('/moderateurs');
    } catch (error) {
      console.error('Erreur lors de la mise à jour du modérateur :', error);
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        clients={clients}
      />
    </div>
  );
};

const Component1 = () => {
  return (
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>
        Pages / Modérateurs / Modifier un profil modérateur
      </div>
      <div className={styles.statistiques}>Modifier le compte modérateur</div>
      <div className={styles.misc}>
        <div className={styles.rectangle356}>
          <div className={styles.searchContainer}>
            <div className={styles.largeInput}>
              <div className={styles.background}></div>
              <div className={styles.searchIcon}>
                <div className={styles.ellipse6}></div>
                <div className={styles.line1}></div>
                <input className={styles.text} type="text" placeholder="Recherche" />
              </div>
            </div>
            <div className={styles.notificationsIcon}>
              <div className={styles.vector}></div>
              <div className={styles.notification}></div>
              <div className={styles.notificationStyle}>
                <Link href="/notifications" className={styles.notificationLink}></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Component2 = ({ formData, handleChange, handleSubmit, clients }) => {
  return (
    <div className={styles.frame48095628}>
      <div className={styles.frame1000001842}>
        <div className={styles.frame1000001843}>
          <div className={styles.frame1000001836}>
            <div className={styles.frame10000018371}>
              <div className={styles.frame781}>
                <input type="text" className={styles.nomModerateur} placeholder="Nom du modérateur *" value={formData.nom_mod} onChange={handleChange} name="nom_mod" />
              </div>
              <div className={styles.frame791}>
                <input type="text" className={styles.prenomModerateur} placeholder="Prénom du modérateur *" value={formData.prenom_mod} onChange={handleChange} name="prenom_mod" />
              </div>
            </div>
            <div className={styles.frame1000001839}>
              <div className={styles.frame10000018372}>
                <div className={styles.frame782}>
                  <input type="text" className={styles.numeroTelephone} placeholder="Numéro de téléphone *" value={formData.numero_telephone_mod} onChange={handleChange} name="numero_telephone_mod" />
                </div>
                <div className={styles.frame792}>
                  <input type="text" className={styles.adresseEmail} placeholder="Adresse email *" value={formData.email} onChange={handleChange} name="email" />
                </div>
              </div>
              <div className={styles.frame10000018374}>
                <div className={styles.frame794}>
                  <select className={styles.client} value={formData.client_id} onChange={handleChange} name="client_id">
                    <option value="">Affecter un client *</option>
                    {clients.map((client) => (
                      <option key={client.client_id} value={client.client_id}>{client.corporation_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.group1572}>
          <button className={styles.btnBg2} onClick={handleSubmit}>
            <div className={styles.btnText2}>Enregistrer les changements</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifierModerateurInterface;
