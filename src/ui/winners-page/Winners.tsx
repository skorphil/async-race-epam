import { useSearchParams } from 'react-router';
import { winnersApi } from '@/services';
import styles from './Winners.module.css';
import CarWinnersContainer from './CarWinnersContainer';

const winnersPerPage = 3;

/**
 * New component
 *
 */
function Winners() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const { data } = winnersApi.useGetWinnersQuery({
    page: currentPage,
    limit: winnersPerPage,
    order: 'ASC',
    sort: 'wins',
  });

  const winners = data?.winners ?? [];
  const totalCount = data?.totalCount ?? 0;

  return (
    <div className={styles.container}>
      <p>{totalCount}</p>
      Winner Page
      {winners.map((winner) => (
        <CarWinnersContainer key={`winner-${winner.id}`} id={winner.id} />
      ))}
    </div>
  );
}

export default Winners;
