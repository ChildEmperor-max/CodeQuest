import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";

export default class CameraControls {
  constructor(renderer) {
    this.renderer = renderer;
  }

  initialize() {
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
  }

  update(objectToFollow) {
    const pos1 = new THREE.Vector3(
      objectToFollow.x - 5,
      objectToFollow.y + 4,
      objectToFollow.z - 5
    );
    const pos = new THREE.Vector3(
      objectToFollow.x,
      objectToFollow.y + 4,
      objectToFollow.z
    );
    this.camera.lookAt(pos);
    this.cameraControls.target = pos;
    this.cameraControls.update();
  }
}
