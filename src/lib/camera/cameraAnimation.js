let stopAnimation = false;

export function animateCameraToTarget(
  cameraControllerInstance,
  targetPosition,
  duration
) {
  stopAnimation = false;

  const startTime = performance.now();

  const animateCamera = (timestamp) => {
    if (stopAnimation) return; // Check if animation should stop

    const progress = (timestamp - startTime) / duration;

    const newPosition = {
      x: lerp(
        cameraControllerInstance.getControllerPosition().x,
        targetPosition.x,
        progress
      ),
      y: lerp(
        cameraControllerInstance.getControllerPosition().y,
        targetPosition.y,
        progress
      ),
      z: lerp(
        cameraControllerInstance.getControllerPosition().z,
        targetPosition.z,
        progress
      ),
    };

    cameraControllerInstance.updateControllerPosition(
      newPosition.x,
      newPosition.y,
      newPosition.z
    );

    // Check if camera is very close to the target position (adjust threshold as needed)
    const threshold = 0.01;
    if (
      Math.abs(newPosition.x - targetPosition.x) < threshold &&
      Math.abs(newPosition.y - targetPosition.y) < threshold &&
      Math.abs(newPosition.z - targetPosition.z) < threshold
    ) {
      stopAnimation = true;
    }

    if (!stopAnimation && progress < 1) {
      requestAnimationFrame(animateCamera);
    }
  };

  // Start the animation
  requestAnimationFrame(animateCamera);
}

export function stopCameraAnimation() {
  stopAnimation = true;
}

function lerp(start, end, progress) {
  return start + progress * (end - start);
}
