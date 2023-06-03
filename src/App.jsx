import React, { useEffect } from "react";
import SceneInit from "./lib/SceneInit";

function App() {
  useEffect(() => {
    const world = new SceneInit("myThreeJsCanvas");
    world.initialize();
    world.animate();
  }, []);

  return (
    <div>
      <canvas
        id="myThreeJsCanvas"
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}

export default App;
