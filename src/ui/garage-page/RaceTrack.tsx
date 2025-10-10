import { useEffect, useState } from 'react';
import styles from './RaceTrack.module.css';

type RaceTrackProps = {
  initialPosition?: number;
  targetPosition?: number;
  timeToFinish?: number;
};

/**
 * Progress of a race
 */
function RaceTrack(props: RaceTrackProps) {
  const { timeToFinish, initialPosition = 0, targetPosition } = props;
  const [width, setWidth] = useState(initialPosition);
  useEffect(() => {
    if (targetPosition) {
      setWidth(targetPosition);
    } else setWidth(initialPosition);
  }, [timeToFinish, initialPosition]);

  return (
    <div>
      <div
        style={{
          width: `${width}%`,
          transition: `width ${timeToFinish || 0}ms linear`,
        }}
        className={styles.progress}
      />
    </div>
  );
}

export default RaceTrack;
