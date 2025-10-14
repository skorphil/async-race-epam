type AnimationParams = {
  initialPosition?: number;
  targetPosition?: number;
  timeToFinish?: number;
};

type CalculateAnimationParams = {
  carState?: string | null;
  driveStarted?: number;
  driveStopped?: number;
  time?: number;
};

/**
 * Calculates animation parameters.
 * Handles case when animations were closed and need to be resumed from
 * non 0 position
 */
export function calculateAnimation(params: CalculateAnimationParams) {
  const { carState, driveStarted, driveStopped, time } = params;

  const animationParams: AnimationParams = {};

  if (carState === 'drive') {
    if (driveStarted && time) {
      const initialPosition = ((Date.now() - driveStarted) / time) * 100;
      animationParams.initialPosition = initialPosition;
      animationParams.timeToFinish = time - (Date.now() - driveStarted);
      animationParams.targetPosition = 100;
    } else {
      animationParams.initialPosition = 0;
      animationParams.timeToFinish = time;
      animationParams.targetPosition = 100;
    }
  }
  if (carState === 'broken') {
    if (driveStopped && driveStarted && time) {
      const initialPosition = ((driveStopped - driveStarted) / time) * 100;
      animationParams.initialPosition = initialPosition;
    }
  }
  if (carState === 'finished') {
    animationParams.initialPosition = 100;
  }

  if (!animationParams.initialPosition) animationParams.initialPosition = 0;

  return animationParams;
}
