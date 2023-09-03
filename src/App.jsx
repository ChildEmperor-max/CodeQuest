import React, { useEffect, useState } from "react";
import InterfaceHandler from "./interface/InterfaceHandler";
import SceneInit from "./lib/SceneInit";
import * as THREE from "three";
import Player from "./player/Player";
import SampleNPC1 from "./npc/SampleNPC1";
import SampleNPC2 from "./npc/SampleNPC2";
import AlbyNPC from "./npc/AlbyNPC";

function App() {
  const [antialiasValue, setAntialiasValue] = useState(false);
  const [shadowMap, setShadowMap] = useState(false);
  const player = new Player();

  const renderDistance = 1000;
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    renderDistance
  );

  const sampleNPC1 = new SampleNPC1();
  const sampleNPC2 = new SampleNPC2();
  const albyNPC = new AlbyNPC();

  const npcs = {
    sampleNPC1: sampleNPC1,
    sampleNPC2: sampleNPC2,
    albyNPC: albyNPC,
  };

  useEffect(() => {
    const canvas = document.getElementById("myThreeJsCanvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: antialiasValue,
    });

    const world = new SceneInit("myThreeJsCanvas", renderer);
    world.initialize(player, npcs, camera);

    const startAnimation = () => {
      world.startAnimation();
    };

    const stopAnimation = () => {
      world.stopAnimation();
    };

    // Handle page visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    // Add event listeners for page visibility change
    document.addEventListener("visibilitychange", handleVisibilityChange);

    startAnimation();

    renderer.shadowMap.enabled = shadowMap;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    // THREE.BasicShadowMap
    // THREE.PCFShadowMap (default)
    // THREE.PCFSoftShadowMap
    // THREE.VSMShadowMap

    return () => {
      renderer.dispose();
      // Remove event listeners for cleanup
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [antialiasValue, shadowMap]);

  return (
    <div>
      <InterfaceHandler
        settings={{
          antialias: {
            antialiasValue: antialiasValue,
            setAntialiasValue: setAntialiasValue,
          },
          shadowMap: {
            shadowMapValue: shadowMap,
            setShadowMapValue: setShadowMap,
          },
        }}
        playerInstance={player}
        npcInstances={npcs}
        cameraInstance={camera}
      />
      <canvas
        id="myThreeJsCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
}

export default App;
