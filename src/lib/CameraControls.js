import * as THREE from "three";
import CameraControls from "camera-controls";

export default class CameraController {
  constructor(renderer) {
    this.renderer = renderer;
  }

  initialize(obstacles) {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    // Modify the render distance
    // this.camera.near = 1; // Adjust the near clipping plane distance
    // this.camera.far = 100; // Adjust the far clipping plane distance

    this.camera.position.set(0, 10, 10);

    this.obstacles = [];

    this.prevCameraPosition = new THREE.Vector3();
    this.floor = undefined;
    this.lastCameraPosition = new THREE.Vector3();

    CameraControls.install({ THREE: THREE });

    this.cameraControl = new CameraControls(
      this.camera,
      this.renderer.domElement
    );
  }

  addCollidables(obstacles, floor) {
    this.obstacles = obstacles;
    this.floor = floor;
    this.cameraControl.colliderMeshes = obstacles;
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
      playerPosition.z
    );
  }

  update(objectToFollow, delta) {
    if (objectToFollow) {
      const pos = new THREE.Vector3(
        objectToFollow.getPosition().x,
        objectToFollow.getPosition().y + 4,
        objectToFollow.getPosition().z
      );
      this.cameraControl.setTarget(pos.x, pos.y, pos.z);
      const camPos = new THREE.Vector3(
        this.cameraControl.getPosition().x,
        this.cameraControl.getPosition().y,
        this.cameraControl.getPosition().z
      );
      if (objectToFollow.currentSpeed != 0) {
        this.cameraControl.setPosition(
          camPos.x +
            objectToFollow.currentSpeed * delta * objectToFollow.direction.x,
          camPos.y,
          camPos.z +
            objectToFollow.currentSpeed * delta * objectToFollow.direction.z
        );
      }
      this.cameraControl.update(delta);

      const movementDirection = new THREE.Vector3()
        .copy(this.camera.position)
        .sub(this.prevCameraPosition);
      movementDirection.y = 0; // If you want to exclude vertical movement (e.g., flying camera)
      movementDirection.normalize();
      this.prevCameraPosition.copy(this.camera.position);

      if (this.floor) {
        this.collisionDetection(
          objectToFollow.getPosition(),
          this.camera,
          this.obstacles,
          this.floor,
          movementDirection
        );
      }
    }
  }

  collisionDetection(target, camera, obstacles, floor, movementDirection) {
    let intersects = [];
    const direction = new THREE.Vector3()
      .subVectors(camera.position, target)
      .normalize();
    const raycaster = new THREE.Raycaster(target, camera.position);
    const allObstacles = obstacles.concat(floor);

    intersects = raycaster.intersectObjects(obstacles);
    if (intersects.length > 0) {
      const distanceToCollision = intersects[0].distance;
      const distanceToTarget = target.distanceTo(camera.position);
      const distance = new THREE.Vector3(
        camera.position.x - target.x,
        camera.position.y - target.y,
        camera.position.z - target.z
      );
      // console.log("collision distance: ", distanceToCollision);
      // console.log("last camera pos: ", this.lastCameraPosition);
      if (distanceToCollision < this.lastCameraPosition) {
        const intersectedObject = intersects[0].object;
        camera.position.set(
          intersects[0].point.x - target.x,
          intersects[0].point.y - target.y,
          intersects[0].point.z - target.z
        );
      }
    } else {
      // this.lastCameraPosition = this.controls.getDistance();
    }
  }
}
