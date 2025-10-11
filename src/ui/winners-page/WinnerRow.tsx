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
      <td className={styles.cell}>{winner?.id}</td>
      <td className={styles.cell}>{car?.name}</td>
      <td className={styles.cell}>{winner?.wins}</td>
      <td className={styles.cell}>{winner?.time}</td>
    </tr>
  );
}

export default WinnerRow;
