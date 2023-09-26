import * as THREE from "three";
// import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { Sky } from "three/addons/objects/Sky.js";

export default class SceneLighting {
  constructor(scene, renderer) {
    this.scene = scene;
    this.renderer = renderer;
  }

  initialize() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // let spotLight = new THREE.SpotLight(0xffffff, 1);
    // spotLight.castShadow = true;
    // spotLight.position.set(0, 264, 32);
    // this.scene.add(spotLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(0, 410, 100);
    this.directionalLight.castShadow = true;

    this.directionalLight.shadowMapWidth = 4048;
    this.directionalLight.shadowMapHeight = 4048;

    // this.directionalLight.shadow.camera.near = 0.5;
    // this.directionalLight.shadow.camera.far = 500;

    this.directionalLight.position.x += 20;
    this.directionalLight.position.y += 20;
    this.directionalLight.position.z += 20;

    this.directionalLight.shadow.camera.left = -250;
    this.directionalLight.shadow.camera.right = 250;
    this.directionalLight.shadow.camera.top = 250;
    this.directionalLight.shadow.camera.bottom = -250;

    // this.directionalLight.shadow.blurSamples = 25;
    this.directionalLight.shadow.bias = -0.005;

    this.scene.add(this.directionalLight);
    const helper = new THREE.CameraHelper(this.directionalLight.shadow.camera);
    // this.scene.add(helper);

    // const helper = new THREE.CameraHelper(light.shadow.camera);
    // this.scene.add(helper);

    // this.initSky(this.renderer);
  }

  initSky(renderer) {
    // Add Sky
    const sky = new Sky();
    sky.scale.setScalar(450000);
    this.scene.add(sky);

    const sun = new THREE.Vector3();

    function updateSky() {
      const uniforms = sky.material.uniforms;
      uniforms["turbidity"].value = 1.6;
      uniforms["rayleigh"].value = 0;
      uniforms["mieCoefficient"].value = 0.06;
      uniforms["mieDirectionalG"].value = 0.7;

      const phi = THREE.MathUtils.degToRad(90 - 83.4);
      const theta = THREE.MathUtils.degToRad(-180);

      sun.setFromSphericalCoords(1, phi, theta);

      uniforms["sunPosition"].value.copy(sun);

      renderer.toneMappingExposure = 0.5;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.5;
    }

    updateSky();
  }

  // initSky(renderer) {
  //   // Add Sky
  //   const sky = new Sky();
  //   sky.scale.setScalar(450000);
  //   this.scene.add(sky);

  //   const sun = new THREE.Vector3();

  //   /// GUI

  //   const effectController = {
  //     turbidity: 1.6,
  //     rayleigh: 0,
  //     mieCoefficient: 0.06,
  //     mieDirectionalG: 0.7,
  //     elevation: 83.4,
  //     azimuth: -180,
  //     exposure: renderer.toneMappingExposure,
  //   };

  //   function guiChanged() {
  //     const uniforms = sky.material.uniforms;
  //     uniforms["turbidity"].value = effectController.turbidity;
  //     uniforms["rayleigh"].value = effectController.rayleigh;
  //     uniforms["mieCoefficient"].value = effectController.mieCoefficient;
  //     uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

  //     const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  //     const theta = THREE.MathUtils.degToRad(effectController.azimuth);

  //     sun.setFromSphericalCoords(1, phi, theta);

  //     uniforms["sunPosition"].value.copy(sun);

  //     renderer.toneMappingExposure = effectController.exposure;
  //     renderer.toneMapping = THREE.ACESFilmicToneMapping;
  //     renderer.toneMappingExposure = 0.5;
  //     // renderer.render(this.scene, camera);
  //   }

  //   const gui = new GUI();

  //   gui.add(effectController, "turbidity", 0.0, 20.0, 0.1).onChange(guiChanged);
  //   gui.add(effectController, "rayleigh", 0.0, 4, 0.001).onChange(guiChanged);
  //   gui
  //     .add(effectController, "mieCoefficient", 0.0, 0.1, 0.001)
  //     .onChange(guiChanged);
  //   gui
  //     .add(effectController, "mieDirectionalG", 0.0, 1, 0.001)
  //     .onChange(guiChanged);
  //   gui.add(effectController, "elevation", 0, 90, 0.1).onChange(guiChanged);
  //   gui.add(effectController, "azimuth", -180, 180, 0.1).onChange(guiChanged);
  //   gui.add(effectController, "exposure", 0, 1, 0.0001).onChange(guiChanged);

  //   guiChanged();
  // }
}
