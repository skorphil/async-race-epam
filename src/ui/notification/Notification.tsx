// src/ui/notification/Notification.tsx
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { XIcon } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store/store';
import styles from './Notification.module.css';
import raceSlice from '@/store/raceSlice';

function Notification() {
  const notification = useSelector((state: RootState) => state.race.winner);
  const dispatch = useDispatch<AppDispatch>();
  const { setWinner } = raceSlice.actions;

  const notificationRoot = document.getElementById('notification-root');
  if (!notificationRoot) return null;
  if (!notification) {
    return null;
  }

  const handleClose = () => {
    dispatch(setWinner(undefined));
  };

  return ReactDOM.createPortal(
    <article className={styles.container}>
      <button type="button" className="outline secondary" onClick={handleClose}>
        <XIcon />
      </button>
      <h2>Winner</h2>
      <p>{notification.name}</p>
      <p>{notification.time}</p>
    </article>,
    notificationRoot,
  );
}

export default Notification;
