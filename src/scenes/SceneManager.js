import * as THREE from "three";

class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.states = {
      world1: new THREE.Object3D(), // Group representing World 1
      world2: new THREE.Object3D(), // Group representing World 2
      // Add more states as needed
    };
    this.currentState = null;
    this.loader = new GLTFLoader();
  }

  loadGLBModel(url, stateName) {
    this.loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        this.states[stateName].add(model);
      },
      undefined,
      (error) => {
        console.error("Error loading GLB model:", error);
      }
    );
  }

  setWorldState(worldName) {
    if (this.currentState !== null) {
      this.scene.remove(this.currentState);
    }

    this.currentState = this.states[worldName];
    this.scene.add(this.currentState);
  }

  update() {
    // Perform any updates required based on the current state
    // For example, you can update object properties, animations, etc.
  }
}

// Usage:
const sceneManager = new SceneManager();

// Load GLB models and set them for world1 and world2
sceneManager.loadGLBModel("path/to/world1.glb", "world1");
sceneManager.loadGLBModel("path/to/world2.glb", "world2");

sceneManager.setWorldState("world1"); // Switch to World 1
sceneManager.update(); // Call this in your render loop to apply state updates
