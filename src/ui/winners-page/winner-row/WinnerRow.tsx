import { CarIcon } from 'lucide-react';
import styles from './WinnerRow.module.css';
import { garageApi, winnersApi } from '@/services';

type WinnersTableProps = {
  id: number;
};
/**
 * Renders winner info
 */
function WinnerRow(props: WinnersTableProps) {
  const { id } = props;
  const { data: winner } = winnersApi.useGetWinnerQuery(id);
  const { data: car } = garageApi.useGetCarQuery(id);

  return (
    <tr className={styles.row}>
      <td className={styles.number}>{winner?.id}</td>
      <td>{car?.name}</td>
      <td>
        <CarIcon color={car?.color} />
      </td>
      <td className={styles.number}>{winner?.wins}</td>
      <td className={styles.number}>{winner?.time}</td>
    </tr>
  );
}

export default WinnerRow;
