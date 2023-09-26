import * as THREE from "three";
import CameraControls from "camera-controls";

export default class CameraController {
  constructor() {
    this.hasStarted = false;
  }

  initialize(renderer, camera, target) {
    this.renderer = renderer;
    this.camera = camera;
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
    this.camLimiter = 16;

    this.lerpVector = new THREE.Vector3();
    this.lerpCamPos = new THREE.Vector3();
    this.cutsceneLerp = new THREE.Vector3();
    this.lerpFactor = 0.15;
    this.cameraTargetY = 10;

    this.isDoneLoading = false;
    this.currentTarget = target;

    this.cameraPosition = new Float32Array(3); // 3 elements for x, y, and z
    this.cameraTarget = new Float32Array(3); // 3 elements for x, y, and z
  }

  addCollidables(collidables, floor) {
    this.collidables = collidables;
    this.floor = floor;
    this.cameraControl.colliderMeshes = collidables;
    this.cameraControl.colliderMeshes.push(this.floor);
  }

  setTrackPosition(target) {
    const cameraOffset = 10;
    this.cameraControl.setFocalOffset(0, 4, 0);
    this.cameraControl.setOrbitPoint(0, 4, 0);
    this.cameraControl.minDistance = 6.0;
    this.cameraControl.maxDistance = 18.0;
    this.cameraControl.setLookAt(
      target.getPosition().x,
      target.getPosition().y + cameraOffset,
      target.getPosition().z + cameraOffset,
      target.getPosition().x,
      target.getPosition().y,
      target.getPosition().z
    );
    this.currentTarget = target;
    if (target.npcName) {
      if (target.npcName === "Alby") {
        console.log("test");
      }
    }
  }

  update(player, delta) {
    if (player) {
      const pos = new THREE.Vector3(
        player.getPositionTracker().x,
        player.getPositionTracker().y + 4,
        player.getPositionTracker().z
      );
      const targetCamPos = new THREE.Vector3(
        this.currentTarget.getPositionTracker().x,
        this.currentTarget.getPositionTracker().y + 4,
        this.currentTarget.getPositionTracker().z
      );
      // const targetCamPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      this.lerpCamPos.lerp(targetCamPos, this.lerpFactor);

      const camPos = new THREE.Vector3(
        this.cameraControl.getPosition().x,
        this.cameraControl.getPosition().y,
        this.cameraControl.getPosition().z
      );

      this.cameraPosition[0] = camPos.x;
      this.cameraPosition[1] = camPos.y;
      this.cameraPosition[2] = camPos.z;

      this.cameraTarget[0] = this.lerpCamPos.x;
      this.cameraTarget[1] = pos.y;
      this.cameraTarget[2] = this.lerpCamPos.z;

      const cameraMovementDir = new THREE.Vector3()
        .copy(this.camera.position)
        .sub(this.prevCameraPosition);
      // cameraMovementDir.y = 0; // If you want to exclude vertical movement (e.g., flying camera)
      cameraMovementDir.normalize();
      this.prevCameraPosition.copy(this.camera.position);

      if (!player.isDoneLoading) {
        this.lerpFactor = 0.9;
      } else {
        this.lerpFactor = 0.65;
      }

      // if (player.isMoving()) {
      // this.cameraControl.setTarget(
      //   this.lerpCamPos.x,
      //   this.lerpCamPos.y,
      //   this.lerpCamPos.z
      // );
      // this.cameraControl.setTarget(pos.x, pos.y, pos.z);
      this.cameraControl.setTarget(
        this.cameraTarget[0],
        this.cameraTarget[1],
        this.cameraTarget[2]
      );
      this.updateTracker(camPos, player, delta, cameraMovementDir);
      // } else {
      // this.cameraControl.setTarget(this.lerpCamPos.x, pos.y, this.lerpCamPos.z);
      // }
      this.cameraControl.update(delta);
    }
  }

  updateTracker(camPos, player, delta, cameraMovementDir) {
    const distanceToPlayer = player
      .getPositionTracker()
      .distanceTo(this.cameraPosition);
    const defaultView = camPos.y - (distanceToPlayer - this.camLimiter);
    const movementView =
      camPos.y - player.currentSpeed * delta * cameraMovementDir.y;

    const targetPosition = new THREE.Vector3(0, player.jumpDistance, 0);
    this.lerpVector.lerp(targetPosition, 0.1);

    if (player.isMoving()) {
      this.cameraTargetY = this.cameraPosition[1] + this.lerpVector.y;
      // this.cameraTargetY = this.lerpVector.y;
      // this.cameraTargetY = defaultView;
    } else {
      this.cameraTargetY = this.cameraPosition[1];
    }
    // console.log(player.movingDirection);

    const targetX =
      this.cameraPosition[0] +
      player.currentSpeed * delta * player.directionTracker.x;
    const targetZ =
      this.cameraPosition[2] +
      player.currentSpeed * delta * player.directionTracker.z;

    const dynamicRangeX = 10;
    const dynamicRangeZ = 10;

    const minX = player.getPosition().x - dynamicRangeX;
    const maxX = player.getPosition().x + dynamicRangeX;
    const minZ = player.getPosition().z - dynamicRangeZ;
    const maxZ = player.getPosition().z + dynamicRangeZ;

    const clampedTargetX = THREE.MathUtils.clamp(targetX, minX, maxX);
    const clampedTargetZ = THREE.MathUtils.clamp(targetZ, minZ, maxZ);

    this.updateControllerPosition(
      clampedTargetX,
      this.cameraTargetY,
      clampedTargetZ
    );
    // this.cameraControl.setPosition(
    //   clampedTargetX,
    //   this.cameraTargetY,
    //   clampedTargetZ
    // );
  }

  updateControllerPosition(x, y, z, smoothing = false) {
    if (smoothing) {
      const targetCamPos = new THREE.Vector3(x, y, z);
      // const targetCamPos = new THREE.Vector3(pos.x, pos.y, pos.z);
      this.cutsceneLerp.lerp(targetCamPos, 0.1);
      this.cameraControl.setPosition(
        this.cutsceneLerp.x,
        this.cutsceneLerp.y,
        this.cutsceneLerp.z
      );
    } else {
      this.cameraControl.setPosition(x, y, z);
    }
  }

  getPosition() {
    return this.cameraControl.getPosition(new THREE.Vector3());
  }
}
