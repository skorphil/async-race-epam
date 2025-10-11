import { NavLink } from 'react-router';
import styles from './Pagination.module.css';

type PaginationProps = {
  pageCount: number;
  currentPage: number;
  onPageChange: (pageId: number) => void;
};

/**
 * Renders list of available pages links
 */
function Pagination(props: PaginationProps) {
  const { currentPage, pageCount, onPageChange } = props;

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className={styles.container}>
      {pages.map((pageId) => (
        <NavLink
          onClick={() => onPageChange(pageId)}
          key={pageId}
          to={`?page=${pageId}`}
          className={() => {
            const isCurrentPage = pageId === currentPage;
            return isCurrentPage ? styles.activeLink : 'null';
          }}
        >
          {pageId}
        </NavLink>
      ))}
    </div>
  );
}

export default Pagination;
