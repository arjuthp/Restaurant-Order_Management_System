import styles from './ReservationsPage.module.css';

const ReservationsPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Table Reservations
      </h1>
      <div className={styles.content}>
        <p className={styles.message}>
          Reservation booking interface will be displayed here. Connect to your backend API.
        </p>
      </div>
    </div>
  );
};

export default ReservationsPage;
