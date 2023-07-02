import React, { useEffect, useState } from "react";
import InterfaceHandler from "./InterfaceHandler";
import SceneInit from "./lib/SceneInit";
import * as THREE from "three";

function App() {
  const [antialias, setAntialias] = useState(false);
  const [shadowMap, setShadowMap] = useState(true);

  useEffect(() => {
    const canvas = document.getElementById("myThreeJsCanvas");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias });

    const world = new SceneInit("myThreeJsCanvas", renderer);
    world.initialize();
    world.animate();

    renderer.antialias = antialias;
    renderer.shadowMap = shadowMap;

    return () => {
      renderer.dispose();
    };
  }, [antialias, shadowMap]);

  return (
    <div>
      <InterfaceHandler
        settings={{
          antialias: {
            antialiasValue: antialias,
            setAntialiasValue: setAntialias,
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
