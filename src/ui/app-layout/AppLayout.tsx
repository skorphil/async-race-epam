import { NavLink, Outlet } from 'react-router';
import { TrophyIcon, WarehouseIcon } from 'lucide-react';
import styles from './AppLayout.module.css';
import Notification from '../notification/Notification';

/**
 * Global App Layout
 */
function AppLayout() {
  return (
    <div className={`${styles.container}`}>
      <nav className={styles.navigation}>
        <NavLink to="/">
          <WarehouseIcon size={24} />
        </NavLink>
        <NavLink to="/winners">
          <TrophyIcon size={24} />
        </NavLink>
      </nav>
      <article className={styles.mainView}>
        <Outlet />
      </article>
      <Notification />
    </div>
  );
}

export default AppLayout;
