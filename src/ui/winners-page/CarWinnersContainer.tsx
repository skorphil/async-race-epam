import { winnersApi } from '@/services';
import CarContainer from '../shared/CarContainer';

type CarWinnersContainerProps = {
  id: number;
};

/**
 * New component
 *
 */
function CarWinnersContainer(props: CarWinnersContainerProps) {
  const { id } = props;
  const { data } = winnersApi.useGetWinnerQuery(id);

  return (
    <CarContainer id={id}>
      <div>
        <p>{`best time: ${data?.time}`}</p>
        <p>{`wins: ${data?.wins}`}</p>
      </div>
    </CarContainer>
  );
}

export default CarWinnersContainer;
