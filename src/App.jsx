import React, { useEffect } from "react";
import InterfaceHandler from "./InterfaceHandler";
import SceneInit from "./lib/SceneInit";

function App() {
  useEffect(() => {
    const world = new SceneInit("myThreeJsCanvas");
    world.initialize();
    world.animate();
  }, []);

  return (
    <div>
      <InterfaceHandler />
      <canvas
        id="myThreeJsCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
      ></canvas>
    </div>
  );
}

export default App;
