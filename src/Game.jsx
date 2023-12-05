import React, { useEffect, useState } from "react";
import InterfaceHandler from "./interface/InterfaceHandler";
import SceneInit from "./lib/SceneInit";
import * as THREE from "three";
import Player from "./player/Player";
import SampleNPC1 from "./npc/SampleNPC1";
import SampleNPC2 from "./npc/SampleNPC2";
import SampleNPC3 from "./npc/SampleNPC3";
import SampleNPC4 from "./npc/SampleNPC4";
import SampleNPC5 from "./npc/SampleNPC5";
import SampleNPC6 from "./npc/SampleNPC6";
import SampleNPC7 from "./npc/SampleNPC7";
import SampleNPC8 from "./npc/SampleNPC8";
import SampleNPC9 from "./npc/SampleNPC9";
import SampleNPC10 from "./npc/SampleNPC10";
import SampleNPC11 from "./npc/SampleNPC11";
import SampleNPC12 from "./npc/SampleNPC12";
import SampleNPC13 from "./npc/SampleNPC13";
import SampleNPC14 from "./npc/SampleNPC14";
import SampleNPC15 from "./npc/SampleNPC15";
import SampleNPC16 from "./npc/SampleNPC16";
import SampleNPC17 from "./npc/SampleNPC17";
import SampleNPC18 from "./npc/SampleNPC18";
import SampleNPC19 from "./npc/SampleNPC19";
import SampleNPC20 from "./npc/SampleNPC20";
import SampleNPC21 from "./npc/SampleNPC21";
import SampleNPC22 from "./npc/SampleNPC22";
import SampleNPC23 from "./npc/SampleNPC23";
import SampleNPC24 from "./npc/SampleNPC24";
import SampleNPC25 from "./npc/SampleNPC25";

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
  const sampleNPC3 = new SampleNPC3();
  const sampleNPC4 = new SampleNPC4();
  const sampleNPC5 = new SampleNPC5();
  const sampleNPC6 = new SampleNPC6();
  const sampleNPC7 = new SampleNPC7();
  const sampleNPC8 = new SampleNPC8();
  const sampleNPC9 = new SampleNPC9();
  const sampleNPC10 = new SampleNPC10();
  const sampleNPC11 = new SampleNPC11();
  const sampleNPC12 = new SampleNPC12();
  const sampleNPC13 = new SampleNPC13();
  const sampleNPC14 = new SampleNPC14();
  const sampleNPC15 = new SampleNPC15();
  const sampleNPC16 = new SampleNPC16();
  const sampleNPC17 = new SampleNPC17();
  const sampleNPC18 = new SampleNPC18();
  const sampleNPC19 = new SampleNPC19();
  const sampleNPC20 = new SampleNPC20();
  const sampleNPC21 = new SampleNPC21();
  const sampleNPC22 = new SampleNPC22();
  const sampleNPC23 = new SampleNPC23();
  const sampleNPC24 = new SampleNPC24();
  const sampleNPC25 = new SampleNPC25();

  const albyNPC = new AlbyNPC();

  const npcs = {
    sampleNPC1: sampleNPC1,
    sampleNPC2: sampleNPC2,
    sampleNPC3: sampleNPC3,
    sampleNPC4: sampleNPC4,
    sampleNPC5: sampleNPC5,
    sampleNPC6: sampleNPC6,
    sampleNPC7: sampleNPC7,
    sampleNPC8: sampleNPC8,
    sampleNPC9: sampleNPC9,
    sampleNPC10: sampleNPC10,
    sampleNPC11: sampleNPC11,
    sampleNPC12: sampleNPC12,
    sampleNPC13: sampleNPC13,
    sampleNPC14: sampleNPC14,
    sampleNPC15: sampleNPC15,
    sampleNPC16: sampleNPC16,
    sampleNPC17: sampleNPC17,
    sampleNPC18: sampleNPC18,
    sampleNPC19: sampleNPC19,
    sampleNPC20: sampleNPC20,
    sampleNPC21: sampleNPC21,
    sampleNPC22: sampleNPC22,
    sampleNPC23: sampleNPC23,
    sampleNPC24: sampleNPC24,
    sampleNPC25: sampleNPC25,

    albyNPC: albyNPC,
  };

  const npcArray = [
    sampleNPC1,
    sampleNPC2,
    sampleNPC3,
    sampleNPC4,
    sampleNPC5,
    sampleNPC6,
    sampleNPC7,
    sampleNPC8,
    sampleNPC9,
    sampleNPC10,
    sampleNPC11,
    sampleNPC12,
    sampleNPC13,
    sampleNPC14,
    sampleNPC15,
    sampleNPC16,
    sampleNPC17,
    sampleNPC18,
    sampleNPC19,
    sampleNPC20,
    sampleNPC21,
    sampleNPC22,
    sampleNPC23,
    sampleNPC24,
    sampleNPC25,

    albyNPC,
  ];

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
