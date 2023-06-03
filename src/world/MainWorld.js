import { LoadWorld } from "./LoadWorld.js";

export function loadSpecificWorld(scene) {
  const worldPath = "/src/assets/world/specific_world.glb"; // Path to your specific world file

  LoadWorld(worldPath)
    .then(({ terrainMesh, obstacles }) => {
      scene.add(terrainMesh);
      // Additional setup or modifications specific to this world can be done here

      console.log("Specific world loaded successfully");
    })
    .catch((error) => {
      console.error("Error loading specific world:", error);
    });
}
