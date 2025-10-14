import { useSearchParams } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/store/store';
import styles from './Garage.module.css';
import { garageApi } from '@/services';
import { Pagination } from '@/ui/shared/pagination';
import { garagePageActions, store } from '@/store';
import { NewCarForm } from './new-car-form';
import { CarContainer } from './car-container';
import useRace from './hooks/useRace';
import { ContentContainer } from '../shared/content-container';

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

  const raceButton =
    Object.keys(raceState.cars).length === 0 ? (
      <button type="button" onClick={handleRaceStart}>
        Start all
      </button>
    ) : (
      <button type="button" onClick={handleRaceReset}>
        Reset all
      </button>
    );

  const pagination = (
    <Pagination
      currentPage={queryParams.page}
      onPageChange={handlePageSave}
      pageCount={Math.ceil(totalCount / carsPerPage)}
    />
  );

  const content =
    cars.length === 0 ? (
      <p>Add cars to garage first</p>
    ) : (
      <>
        <NewCarForm />
        <section className={styles.carsList}>
          {cars?.map((car) => (
            <CarContainer key={`car-${car.id}`} id={car.id} />
          ))}
        </section>
      </>
    );
  return (
    <ContentContainer
      headerText={`Garage (${totalCount})`}
      headerControls={raceButton}
      footer={pagination}
    >
      {content}
    </ContentContainer>
  );
}

export default Garage;
