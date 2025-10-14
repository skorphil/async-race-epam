// src/ui/notification/Notification.tsx
import ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import styles from './Notification.module.css';

function Notification() {
  const notification = useSelector((state: RootState) => state.race.winner);

  const notificationRoot = document.getElementById('notification-root');
  if (!notificationRoot) return null;
  if (!notification) {
    return null;
  }

  return ReactDOM.createPortal(
    <article className={styles.container}>
      <h2>Winner</h2>
      <p>{notification.name}</p>
      <p>{notification.time}</p>
    </article>,
    notificationRoot,
  );
}

export default Notification;
