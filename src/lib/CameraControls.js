import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

export default class CameraControls {
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
    // this.camera.far = 200; // Adjust the far clipping plane distance

    this.camera.position.set(0, 10, 10);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.enableDamping = true;
    this.controls.zoomSpeed = 0.5;
    this.controls.rotateSpeed = 0.5;
    this.controls.enablePan = false;
    this.controls.update();
    this.camera.updateProjectionMatrix();
    // Update the camera's projection matrix to apply the changes

    this.cameraControls = new TrackballControls(
      this.camera,
      this.renderer.domElement
    );
    this.cameraControls.rotateSpeed = 0;
    this.cameraControls.noZoom = true; // disable zooming
    this.cameraControls.noPan = true; // disable panning
    this.cameraControls.enabled = false;
    this.cameraControls.update();

    this.obstacles = obstacles;

    this.prevCameraPosition = new THREE.Vector3();
  }

  addObstacles(obstacles) {
    this.obstacles = obstacles;
  }

  update(objectToFollow) {
    if (objectToFollow) {
      const pos = new THREE.Vector3(
        objectToFollow.getPosition().x,
        objectToFollow.getPosition().y + 4,
        objectToFollow.getPosition().z
      );
      this.camera.lookAt(pos);
      this.cameraControls.target = pos;
      this.cameraControls.update();

      const movementDirection = new THREE.Vector3()
        .copy(this.camera.position)
        .sub(this.prevCameraPosition);
      movementDirection.y = 0; // If you want to exclude vertical movement (e.g., flying camera)
      movementDirection.normalize();
      this.prevCameraPosition.copy(this.camera.position);

      this.collisionDetection(
        objectToFollow.getPosition(),
        this.camera,
        this.obstacles,
        movementDirection
      );
    }
  }

  collisionDetection(target, camera, obstacles, movementDirection) {
    let intersects = [];
    const direction = new THREE.Vector3()
      .subVectors(camera.position, target)
      .normalize();
    const raycaster = new THREE.Raycaster(target, camera.position);
    intersects = raycaster.intersectObjects(obstacles);
    if (intersects.length > 0) {
      const distanceToCollision = intersects[0].distance;
      const distanceToTarget = target.distanceTo(camera.position);
      if (distanceToCollision < distanceToTarget) {
        const intersectedObject = intersects[0].object;
        camera.position.set(
          intersects[0].point.x - target.x,
          intersects[0].point.y - target.y,
          intersects[0].point.z - target.z
        );
      }
    }
  }
}
