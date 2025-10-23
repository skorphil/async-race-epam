import { useEffect, useState } from 'react';
import { CarIcon } from 'lucide-react';
import styles from './RaceTrack.module.css';

type RaceTrackProps = {
  initialPosition?: number;
  targetPosition?: number;
  timeToFinish?: number;
  trackColor: string;
};

/**
 * Progress of a race
 */
function RaceTrack(props: RaceTrackProps) {
  const {
    timeToFinish,
    initialPosition = 0,
    targetPosition,
    trackColor,
  } = props;
  const [width, setWidth] = useState(initialPosition);
  useEffect(() => {
    if (targetPosition) {
      setWidth(targetPosition);
    } else setWidth(initialPosition);
  }, [timeToFinish, initialPosition]);

  return (
    <div className={styles.container}>
      <CarIcon
        size={32}
        color={trackColor}
        style={{
          marginLeft: `${width}%`,
          transition: `margin-left ${timeToFinish || 0}ms linear`,
        }}
      />
    </div>
  );
}

export default RaceTrack;
