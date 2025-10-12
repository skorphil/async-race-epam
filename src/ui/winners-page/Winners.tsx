import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { winnersApi } from '@/services';
import styles from './Winners.module.css';
import WinnerRow from './WinnerRow';
import { store, type AppDispatch } from '@/store/store';
import Pagination from '../shared/Pagination';
import { winnersPageActions } from '@/store';
import { ArrowDown10, ArrowUp01 } from 'lucide-react';

const winnersPerPage = 3;

type NumberString = string;
type SortOption = 'wins' | 'id' | 'time';
type OrderOption = 'ASC' | 'DESC';

function isSortOption(string: unknown): string is SortOption {
  if (typeof string !== 'string') return false;
  if (['wins', 'id', 'time'].includes(string.toLowerCase())) return true;
  return false;
}
function isOrderOption(string: unknown): string is OrderOption {
  if (typeof string !== 'string') return false;
  if (['ASC', 'DESC'].includes(string.toUpperCase())) return true;
  return false;
}

function isNumberString(NumberString: unknown): NumberString is NumberString {
  if (typeof NumberString !== 'string') return false;
  if (typeof parseInt(NumberString, 10) === 'number') return true;
  return false;
}

function getQueryParams(page: unknown, order: unknown, sort: unknown) {
  const searchQueryParams: {
    sort: SortOption;
    page: number;
    limit: number;
    order: OrderOption;
  } = {
    limit: winnersPerPage,
    order: isOrderOption(order) ? order : 'DESC',
    page: isNumberString(page) ? Number(page) : 1,
    sort: isSortOption(sort) ? sort : 'id',
  };
  return searchQueryParams;
}

/**
 * New component
 */
function Winners() {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = getQueryParams(
    searchParams.get('page'),
    searchParams.get('order'),
    searchParams.get('sort'),
  );
  const { data } = winnersApi.useGetWinnersQuery(queryParams);

  const winners = data?.winners ?? [];
  const totalCount = data?.totalCount ?? 0;

  const handlePageChange = (targetPage: number) => {
    dispatch(winnersPageActions.setPage(targetPage));
  };

  const handleSortingChange = (sort: SortOption) => {
    setSearchParams((params) => {
      const newOrder = queryParams.order === 'ASC' ? 'DESC' : 'ASC';
      const newParams = new URLSearchParams(params);
      newParams.set('sort', sort);
      newParams.set('order', newOrder);
      return newParams;
    });
  };

  const orderIcon =
    queryParams.order === 'ASC' ? (
      <ArrowUp01 size={16} />
    ) : (
      <ArrowDown10 size={16} />
    );

  useEffect(() => {
    const { order, page, sort } = store.getState().winnersPage;
    if (!searchParams.has('sort') && sort) {
      setSearchParams((params) => {
        const newParams = new URLSearchParams(params);
        newParams.set('sort', sort.toString());
        return newParams;
      });
    }
    if (!searchParams.has('order') && order) {
      setSearchParams((params) => {
        const newParams = new URLSearchParams(params);
        newParams.set('page', order);
        return newParams;
      });
    }
    if (!searchParams.has('page') && page) {
      setSearchParams((params) => {
        const newParams = new URLSearchParams(params);
        newParams.set('page', page.toString());
        return newParams;
      });
    }
    if (searchParams.has('sort')) {
      dispatch(winnersPageActions.setSort(queryParams.sort));
    }
    if (searchParams.has('order')) {
      dispatch(winnersPageActions.setOrder(queryParams.order));
    }
    if (searchParams.has('page')) {
      dispatch(winnersPageActions.setPage(queryParams.page));
    }
  }, []);

  useEffect(() => {
    if (winners.length === 0 && totalCount > 0) {
      const targetPage = Math.ceil(totalCount / winnersPerPage);
      setSearchParams({
        page: targetPage.toString(),
      });
      handlePageChange(targetPage);
    }
  }, [winners, totalCount]);

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Winners</h2>
      <p>{`Total: ${totalCount}`}</p>
      <table className={styles.winnersTable}>
        <thead>
          <tr>
            <th scope="col">
              <button type="button" onClick={() => handleSortingChange('id')}>
                id
                {queryParams.sort === 'id' && orderIcon}
              </button>
            </th>
            <th scope="col">Name</th>
            <th scope="col">
              <button type="button" onClick={() => handleSortingChange('wins')}>
                wins
                {queryParams.sort === 'wins' && orderIcon}
              </button>
            </th>
            <th scope="col">
              <button type="button" onClick={() => handleSortingChange('time')}>
                best time
                {queryParams.sort === 'time' && orderIcon}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {winners.map((winner) => (
            <WinnerRow key={`winner-row-${winner.id}`} id={winner.id} />
          ))}
        </tbody>
      </table>
      <Pagination
        onPageChange={handlePageChange}
        pageCount={Math.ceil(totalCount / winnersPerPage)}
        currentPage={queryParams.page}
      />
    </div>
  );
}

export default Winners;
