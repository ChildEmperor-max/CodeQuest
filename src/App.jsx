import React, { useEffect, useState } from "react";
import InterfaceHandler from "./InterfaceHandler";
import SceneInit from "./lib/SceneInit";
import * as THREE from "three";

function App() {
  const [antialiasValue, setAntialiasValue] = useState(false);
  const [shadowMap, setShadowMap] = useState(false);

  useEffect(() => {
    const canvas = document.getElementById("myThreeJsCanvas");
    const renderer = new THREE.WebGLRenderer({ canvas, antialiasValue });

    const world = new SceneInit("myThreeJsCanvas", renderer);
    world.initialize();
    world.animate();

    renderer.shadowMap = shadowMap;

    return () => {
      renderer.dispose();
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
