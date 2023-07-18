import React, { useEffect, useState } from "react";
import InterfaceHandler from "./interface/InterfaceHandler";
import SceneInit from "./lib/SceneInit";
import * as THREE from "three";

function App() {
  const [antialiasValue, setAntialiasValue] = useState(false);
  const [shadowMap, setShadowMap] = useState(false);

  useEffect(() => {
    const canvas = document.getElementById("myThreeJsCanvas");
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: antialiasValue,
    });
    const mainScene = new THREE.Scene();

    const world = new SceneInit("myThreeJsCanvas", renderer, mainScene);
    world.initialize();

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
    renderer.shadowMap.type = THREE.VSMShadowMap;
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
