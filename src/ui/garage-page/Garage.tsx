import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styles from './Garage.module.css';
import CarGarageContainer from './CarGarageContainer';
import useRace from './useRace';
import { garageApi } from '@/services';
import Pagination from '../shared/Pagination';
import { garagePageActions, store } from '@/store';
import type { AppDispatch } from '@/store/store';
import NewCarForm from './NewCarForm';

const carsPerPage = 7;
type NumberString = string;

function isNumberString(NumberString: unknown): NumberString is NumberString {
  if (typeof NumberString !== 'string') return false;
  if (typeof parseInt(NumberString, 10) === 'number') return true;
  return false;
}

function getQueryParams(page: unknown) {
  const searchQueryParams: {
    page: number;
    limit: number;
  } = {
    page: isNumberString(page) ? Number(page) : 1,
    limit: carsPerPage,
  };
  return searchQueryParams;
}

/**
 * Displays all cars in the garage by pages
 */
function Garage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParams = getQueryParams(searchParams.get('page'));
  const { data, error } = garageApi.useGetCarsQuery(queryParams);
  const { raceReset, raceStart, raceState } = useRace({
    cars: data?.cars || [],
  });
  const dispatch = useDispatch<AppDispatch>();

  const handlePageSave = (targetPage: number) => {
    dispatch(garagePageActions.setPage(targetPage));
  };

  useEffect(() => {
    const { page } = store.getState().garagePage;
    if (!searchParams.has('page') && page) {
      setSearchParams((params) => {
        const newParams = new URLSearchParams(params);
        newParams.set('page', page.toString());
        return newParams;
      });
    }
    if (searchParams.has('page')) {
      handlePageSave(queryParams.page);
    }
  });

  useEffect(() => {
    if (data?.cars.length === 0 && data.totalCount > 0) {
      const targetPage = Math.ceil(data.totalCount / carsPerPage);
      setSearchParams({
        page: targetPage.toString(),
      });
      handlePageSave(targetPage);
    }
  }, [data]);

  const cars = data?.cars ?? [];
  const totalCount = data?.totalCount ?? 0;

  async function handleRaceStart() {
    raceStart();
  }

  async function handleRaceReset() {
    raceReset();
  }

  return (
    <div className={styles.container}>
      {error && <p>{error.error ? error.error : error.message}</p>}
      <p>{totalCount}</p>
      <NewCarForm />
      {Object.keys(raceState.cars).length === 0 ? (
        <button type="button" onClick={handleRaceStart}>
          Race Start
        </button>
      ) : (
        <button type="button" onClick={handleRaceReset}>
          Race Reset
        </button>
      )}
      <section className={styles.carsList}>
        {cars?.map((car) => (
          <CarGarageContainer key={`car-${car.id}`} id={car.id} />
        ))}
      </section>
      <Pagination
        currentPage={queryParams.page}
        onPageChange={handlePageSave}
        pageCount={Math.ceil(totalCount / carsPerPage)}
      />
    </div>
  );
}

export default Garage;
