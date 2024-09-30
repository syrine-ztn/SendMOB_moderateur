import React, { useState, useEffect } from 'react';
import styles from '../styles/moderateurs_interface.module.css';
import Link from 'next/link';
import { useTable } from 'react-table';
import axios from 'axios';

const ModerateursInterface = () => {
  const [moderateurs, setModerateurs] = useState([]);
  const [page, setPage] = useState(1); // Définir la page initiale sur 1
  const [totalPages, setTotalPages] = useState(1); // Définir le nombre total de pages

  useEffect(() => {
    const fetchModerateurs = async () => {
      // Récupérer le jeton d'authentification depuis le stockage local
      const token = localStorage.getItem('token');

      try {

        const response1 = await axios.get(`http://localhost:8000/moderateurs/getAllModerateurs`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        const response = await axios.get(`http://localhost:8000/moderateurs/getAllModerateurs/${page}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        setModerateurs(response.data);

        // Calculer le nombre total de pages en fonction de la longueur des données modérateurs
        const totalCount = response1.data.length;
        const moderateursPerPage = 10; // Supposons que 10 modérateurs par page
        const totalPagesCount = Math.ceil(totalCount / moderateursPerPage);
        setTotalPages(totalPagesCount);
      } catch (error) {
        console.error('Error fetching modérateurs:', error);
      }
    };

    fetchModerateurs();
  }, [page]); // Mettre à jour lorsque la page change

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return (
    <div className={styles.container}>
      <Component1 />
      <Component2 />
      <ModerateursTable data={moderateurs} setModerateurs={setModerateurs} />
      <Pagination
        handlePageChange={handlePageChange}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
};

const Component1 = () => {
  return (
    <div className={styles.dashboardInterface}>
      <div className={styles.pageTitle}>Pages / Modérateurs</div>
      <div className={styles.statistiques}>Modérateurs et affectations</div>
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

const Component2 = () => {
  return (
    <div className={styles.container2}>
      <Link href="#" className={styles.button1}>
        <div className={styles.barChart}>
          <div className={styles.statusIcon}></div>
          <div className={styles.statusText}>Status</div>
        </div>
      </Link>

      <Link href="#" className={styles.button2}>
        <div className={styles.icon1}></div>
      </Link>

      <Link href="#" className={styles.button3}>
        <div className={styles.icon2}></div>
      </Link>

      <Link href="/creer_moderateur" className={styles.clientButton}>
        <div className={styles.icon}></div>
        <div className={styles.buttonText}>Créer un nouveau modérateur</div>
      </Link>
    </div>
  );
};

const ModerateursTable = ({ data, setModerateurs }) => {
  const [isFrameVisible, setIsFrameVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isPopupVisible, setPopupVisibility] = useState(false);

  const handlePopUpClick = async (elementId) => {
    switch (elementId) {
      case 'frame19':
        setPopupVisibility(!isPopupVisible);
        break;
      case 'annuler':
      case 'phX':
        setPopupVisibility(false);
        break;
      case 'bloquerbtn':
        try {
          // Envoi d'une requête à l'API pour bloquer le modérateur avec l'ID sélectionné
          if (selectedUserId !== null) {
            // Récupérer le jeton d'authentification depuis le stockage local
            const token = localStorage.getItem('token');

            // Envoyer la requête à l'API avec l'ID du modérateur à bloquer
            await axios.put(`http://localhost:8000/moderateurs/blockModerateur/${selectedUserId}`, null, {
              headers: {
                Authorization: `${token}`,
              },
            });

            // Mettre à jour l'état local des modérateurs pour refléter le blocage
            const updatedModerateurs = data.map((moderateur) => {
              if (moderateur.mod_id === selectedUserId) {
                return { ...moderateur, status_mod: 'Bloqué' };
              }
              return moderateur;
            });

            // Mettre à jour l'état avec les données modifiées
            setModerateurs(updatedModerateurs);
          }
        } catch (error) {
          console.error('Error blocking moderator:', error);
        }
        setPopupVisibility(false);
        break;
      default:
        break;
    }
  };

  const visibilityClick = (userId) => {
    setIsFrameVisible((prevVisibility) => !prevVisibility);
    setSelectedUserId(userId);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Modérateur ID',
        accessor: 'mod_id',
      },
      {
        Header: 'Nom',
        accessor: 'nom_mod',
      },
      {
        Header: 'Prénom',
        accessor: 'prenom_mod',
      },
      {
        Header: 'Téléphone',
        accessor: 'numero_telephone_mod',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Statut',
        accessor: 'status_mod',
        Cell: ({ row }) => (
          <div className={`${styles.statut} ${row.original.status_mod === 'Actif' ? styles.actif : styles.bloque}`}>
            {row.original.status_mod}
          </div>
        ),
      },
      {
        Header: 'Action',
        accessor: 'action',
        Cell: ({ row }) => (
          <button onClick={() => visibilityClick(row.original.mod_id)} className={styles.action}>
            Voir les détails
          </button>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div>
      {isPopupVisible && (
        <div className={styles.group2220}>
          <div className={styles.rectangle4429}>
            <div className={styles.phX} onClick={() => setPopupVisibility(false)}></div>

            <div className={styles.frame1000001834}>
              <p className={styles.Message}>Voulez-vous vraiment bloquer ce modérateur ?</p>
            </div>

            <div className={styles.group2219}>
              {/* Red Button */}
              <button
                className={`${styles.button} ${styles.redButton}`}
                onClick={() => handlePopUpClick('bloquerbtn')}
              >
                <div className={styles.horizontalStack}>
                  <div className={styles.bloquerbtn}>Bloquer</div>
                </div>
              </button>

              {/* White Button */}
              <button
                className={`${styles.button} ${styles.whiteButton}`}
                onClick={() => setPopupVisibility(false)}
              >
                <div className={styles.horizontalStack}>
                  <div className={styles.annuler}>Annuler</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.frame42579} style={{ display: isFrameVisible ? 'block' : 'none' }}>
        {/* Modifier le profil */}
        <Link
          href={{ pathname: '/modifier_moderateur', query: { userId: selectedUserId } }}
          as={`/modifier_moderateur?userId=${selectedUserId}`}
          className={styles.frame18}
        >
          <span className={styles.modifierProfil}>Modifier le profil</span>
        </Link>

        {/* Bloquer */}
        <button className={styles.frame19} onClick={() => setPopupVisibility(true)}>
          <span className={styles.bloquer}>Bloquer</span>
        </button>
      </div>

      <table {...getTableProps()} className={styles.moderateurTableContainer}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className={styles.tableHeader}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} className={styles[column.id]}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className={styles.dataShow}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} className={styles[cell.column.id]}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = ({ handlePageChange, handlePrevPage, handleNextPage, currentPage, totalPages }) => {
  const chevronDownClick = () => {
    handlePrevPage();
  };

  const chevronUpClick = () => {
    handleNextPage();
  };

  return (
    <div className={styles.page}>
      <div className={styles.chevronDown}>
        <button onClick={chevronDownClick}></button>
      </div>
      <div className={styles.circle}>
        <div className={styles.text1}>{currentPage}</div>
        {currentPage > 1 && <button onClick={() => handlePageChange(currentPage - 1)}></button>}
      </div>
      <div className={styles.circle2}>
        <div className={styles.text2}>{currentPage + 1}</div>
        {currentPage + 1 <= totalPages && <button onClick={() => handlePageChange(currentPage + 1)}></button>}
      </div>
      <div className={styles.circle3}>
        <div className={styles.text3}>{currentPage + 2}</div>
        {currentPage + 2 <= totalPages && <button onClick={() => handlePageChange(currentPage + 2)}></button>}
      </div>
      <div className={styles.chevronUp}>
        <button onClick={chevronUpClick}></button>
      </div>
    </div>
  );
};

export default ModerateursInterface;
