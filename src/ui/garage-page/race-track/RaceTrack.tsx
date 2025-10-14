import { useEffect, useState } from 'react';
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
      <div
        style={{
          width: `${width}%`,
          backgroundColor: trackColor,
          transition: `width ${timeToFinish || 0}ms linear`,
        }}
        className={styles.progress}
      />
    </div>
  );
}

export default RaceTrack;
