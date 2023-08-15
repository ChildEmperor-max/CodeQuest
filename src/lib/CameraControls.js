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

      if (objectToFollow.currentSpeed !== 0) {
        const distance = objectToFollow.getPosition().distanceTo(camPos);

        if (distance > 20) {
          // Calculate the new y position to prevent it from increasing
          const newY = camPos.y - (distance - 20); // Adjust this value as needed

          this.cameraControl.setPosition(
            camPos.x +
              objectToFollow.currentSpeed * delta * objectToFollow.direction.x,
            newY,
            camPos.z +
              objectToFollow.currentSpeed * delta * objectToFollow.direction.z
          );
        } else {
          this.cameraControl.setPosition(
            camPos.x +
              objectToFollow.currentSpeed * delta * objectToFollow.direction.x,
            camPos.y,
            camPos.z +
              objectToFollow.currentSpeed * delta * objectToFollow.direction.z
          );
        }
      }

      console.log(objectToFollow.getPosition().distanceTo(camPos));

      // if (objectToFollow.currentSpeed != 0) {
      //   this.cameraControl.setPosition(
      //     camPos.x +
      //       objectToFollow.currentSpeed * delta * objectToFollow.direction.x,
      //     camPos.y +
      //       objectToFollow.currentSpeed * delta * objectToFollow.direction.y,
      //     camPos.z +
      //       objectToFollow.currentSpeed * delta * objectToFollow.direction.z
      //   );
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
}
