import React, { useEffect, useState } from "react";
import InterfaceHandler from "./interface/InterfaceHandler";
import SceneInit from "./lib/SceneInit";
import * as THREE from "three";
import Player from "./player/Player";
import SampleNPC1 from "./npc/SampleNPC1";
import SampleNPC2 from "./npc/SampleNPC2";
import AlbyNPC from "./npc/AlbyNPC";
import CameraController from "./lib/camera/CameraControls";
import { useWorldContext } from "./components/WorldContext";
import Loader from "./components/loader/Loader";

const Game = () => {
  document.body.classList.add("overflow-hidden");
  const { initializeNpcs } = useWorldContext();
  const [antialiasValue, setAntialiasValue] = useState(false);
  const [shadowMap, setShadowMap] = useState(false);
  const [renderDistance, setRenderDistance] = useState(300);
  const player = new Player();
  const [isLoading, setIsLoading] = useState(true);

  const fov = 65;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const cameraNear = 0.1;
  const cameraFar = 1000;
  const camera = new THREE.PerspectiveCamera(
    fov,
    aspectRatio,
    cameraNear,
    cameraFar
  );
  const cameraControls = new CameraController();

  const sampleNPC1 = new SampleNPC1();
  const sampleNPC2 = new SampleNPC2();
  const albyNPC = new AlbyNPC();

  const npcs = {
    sampleNPC1: sampleNPC1,
    sampleNPC2: sampleNPC2,
    albyNPC: albyNPC,
  };

  const npcArray = [sampleNPC1, sampleNPC2, albyNPC];

  useEffect(() => {
    const handleStartLoader = (event) => {
      // setIsLoading(event.detail);
      setIsLoading(true);
      console.log("loading: ", event.detail);
    };
    document.addEventListener("loadingWorld", handleStartLoader);

    return () => {
      document.removeEventListener("loadingWorld", handleStartLoader);
    };
  }, [isLoading]);

  useEffect(() => {
    const handleStartLoader = (event) => {
      setIsLoading(false);
      console.log("test");
    };
    document.addEventListener("finishedLoadingWorld", handleStartLoader);

    return () => {
      document.removeEventListener("finishedLoadingWorld", handleStartLoader);
    };
  }, [isLoading]);

  useEffect(() => {
    const canvas = document.getElementById("myThreeJsCanvas");
    const loaderElement = document.getElementById("loading-game-screen");
    const mainWorldScene = new THREE.Scene();

    const textLoaderElement = document.getElementById(
      "loading-game-screen-text"
    );
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: antialiasValue,
    });

    const world = new SceneInit(
      "myThreeJsCanvas",
      renderer,
      loaderElement,
      textLoaderElement
    );
    cameraControls.initialize(renderer, camera, player);
    world.initialize(player, npcs, camera, cameraControls, mainWorldScene);
    initializeNpcs(npcArray);
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
      cleanUpScene(mainWorldScene, renderer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [antialiasValue, shadowMap]);

  const cleanUpScene = (scene, renderer) => {
    const cleanMaterial = (material) => {
      material.dispose();

      // dispose textures
      for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === "object" && "minFilter" in value) {
          value.dispose();
        }
      }
    };

    scene.traverse((object) => {
      if (!object.isMesh) return;

      object.geometry.dispose();

      if (object.material.isMaterial) {
        cleanMaterial(object.material);
      } else {
        // an array of materials
        for (const material of object.material) cleanMaterial(material);
      }
    });

    renderer.domElement.remove();

    renderer.dispose();
  };

  return (
    <div>
      <>
        <div id="loading-game-screen">
          <p id="loading-game-screen-text"></p>
        </div>
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
          npcInstances={npcArray}
          cameraInstance={camera}
          cameraControllerInstance={cameraControls}
        />
        <canvas
          id="myThreeJsCanvas"
          width={window.innerWidth}
          height={window.innerHeight}
        ></canvas>
      </>
    </div>
  );
};

export default Game;
