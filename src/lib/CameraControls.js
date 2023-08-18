import * as THREE from "three";
import CameraControls from "camera-controls";

export default class CameraController {
  constructor(renderer, camera) {
    this.renderer = renderer;
    this.camera = camera;
  }

  initialize() {
    this.collidables = [];

    this.prevCameraPosition = new THREE.Vector3();
    this.floor = undefined;
    this.lastCameraPosition = new THREE.Vector3();

    CameraControls.install({ THREE: THREE });

    this.cameraControl = new CameraControls(
      this.camera,
      this.renderer.domElement
    );
    this.cameraControl.smoothTime = 0.8;
    this.camLimiter = 15;

    this.lerpVector = new THREE.Vector3();
  }

  addCollidables(collidables, floor) {
    this.collidables = collidables;
    this.floor = floor;
    this.cameraControl.colliderMeshes = collidables;
    this.cameraControl.colliderMeshes.push(this.floor);
  }

  setTrackPosition(playerPosition) {
    const cameraOffset = 10;
    this.cameraControl.setFocalOffset(0, 4, 0, true);
    this.cameraControl.setOrbitPoint(0, 4, 0);
    this.cameraControl.minDistance = 6.0;
    this.cameraControl.maxDistance = 18.0;
    this.cameraControl.setLookAt(
      playerPosition.x,
      playerPosition.y + cameraOffset,
      playerPosition.z + cameraOffset,
      playerPosition.x,
      playerPosition.y,
      playerPosition.z,
      true
    );
  }

  update(player, delta) {
    if (player) {
      const pos = new THREE.Vector3(
        player.getPosition().x,
        player.getPositionTracker() + 4,
        player.getPosition().z
      );
      this.cameraControl.setTarget(pos.x, pos.y, pos.z);
      const camPos = new THREE.Vector3(
        this.cameraControl.getPosition().x,
        this.cameraControl.getPosition().y,
        this.cameraControl.getPosition().z
      );

      if (player.currentSpeed !== 0) {
        this.updateTracker(camPos, player, delta);
      }
      // if (this.cameraControl.currentAction === 1) {
      //   this.camLimiter = player.getPosition().distanceTo(camPos);
      // } else {
      //   this.camLimiter = 15;
      // }
      this.cameraControl.update(delta);

      const movementDirection = new THREE.Vector3()
        .copy(this.camera.position)
        .sub(this.prevCameraPosition);
      movementDirection.y = 0; // If you want to exclude vertical movement (e.g., flying camera)
      movementDirection.normalize();
      this.prevCameraPosition.copy(this.camera.position);
    }
  }

  updateTracker(camPos, player, delta) {
    const distance = player.getPosition().distanceTo(camPos);
    const newY = camPos.y - (distance - this.camLimiter);

    const targetX =
      camPos.x + player.currentSpeed * delta * player.directionTracker.x;
    const targetZ =
      camPos.z + player.currentSpeed * delta * player.directionTracker.z;

    const dynamicRangeX = 10;
    const dynamicRangeZ = 10;

    // Calculate dynamic ranges based on player position and movement
    const minX = player.getPosition().x - dynamicRangeX; // Adjust dynamicRangeX as needed
    const maxX = player.getPosition().x + dynamicRangeX;
    const minZ = player.getPosition().z - dynamicRangeZ; // Adjust dynamicRangeZ as needed
    const maxZ = player.getPosition().z + dynamicRangeZ;

    const targetPosition = new THREE.Vector3(targetX, newY, targetZ);
    const lerpFactor = 0.15;
    this.lerpVector.lerp(targetPosition, lerpFactor);

    // Clamp the target x and z within the dynamic ranges
    const clampedTargetX = THREE.MathUtils.clamp(targetX, minX, maxX);
    const clampedTargetZ = THREE.MathUtils.clamp(targetZ, minZ, maxZ);
    this.cameraControl.setPosition(
      clampedTargetX,
      this.lerpVector.y,
      clampedTargetZ,
      true
    );
    //   this.cameraControl.setPosition(
    //     camPos.x +
    //       player.currentSpeed * delta * player.direction.x,
    //     camPos.y +
    //       player.currentSpeed * delta * player.direction.y,
    //     camPos.z +
    //       player.currentSpeed * delta * player.direction.z
    //   );
  }
}
