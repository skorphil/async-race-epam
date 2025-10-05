import { NavLink, Outlet } from 'react-router';
import styles from './AppLayout.module.css';

/**
 * Global App Layout
 */
function AppLayout() {
  return (
    <div className={styles.container}>
      <NavLink to="/">Garage</NavLink>
      <NavLink to="/winners">Winners</NavLink>
      <Outlet />
    </div>
  );
}

export default AppLayout;
