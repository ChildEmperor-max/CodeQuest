import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { TWEEN } from "three/examples/jsm/libs/tween.module.min.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import keys from "../lib/KeyControls";

const NPCLoader = ({ modelPath, npcName, modelTexturePath, scale, scene }) => {
  const meshRef = useRef();
  const mixerRef = useRef();
  const initActionRef = useRef();

  useEffect(() => {
    const fbxLoader = new FBXLoader();
    fbxLoader.load(
      modelPath,
      (fbx) => {
        fbx.position.set(
          meshRef.current.position.x,
          meshRef.current.position.y,
          meshRef.current.position.z
        );
        fbx.scale.set(scale, scale, scale);
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (modelTexturePath !== undefined) {
              if (modelTexturePath.length > 1) {
                // ...
              }
            }

            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        fbx.rotation.copy(meshRef.current.defaultRotation);
        fbx.name = npcName;
        scene.add(fbx);
        meshRef.current.mesh = fbx;

        mixerRef.current = new THREE.AnimationMixer(meshRef.current.mesh);
        initActionRef.current = meshRef.current.actionClipAnimation(fbx, scale);
        initActionRef.current.name = "init";
        // meshRef.current.actions.push(initActionRef.current);
        initActionRef.current.paused = false;
        initActionRef.current.play();
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    return () => {
      // Cleanup code if needed
    };
  }, []);

  const update = (player, delta) => {
    if (mixerRef.current) {
      // ...
    }
  };

  const updateInteractionRange = (player) => {
    var distanceThreshold = 10;
    var playerPosition = player.getPosition();
    var npcPosition = meshRef.current.getPosition();

    var distance = playerPosition.distanceTo(npcPosition);

    if (distance <= distanceThreshold) {
      console.log("near");
      if (keys.e.pressed) {
        meshRef.current.rotateTowards(playerPosition);
      }
      // button.style.display = "block";
    } else {
      meshRef.current.rotateTowards(meshRef.current.mesh.position);
      // button.style.display = "none";
    }
  };

  const rotateTowards = (targetPosition) => {
    // ...
  };

  const actionClipAnimation = (fbx, scale) => {
    fbx.scale.set(scale, scale, scale);
    const animationClip = fbx.animations[0];
    const animationAction = mixerRef.current.clipAction(animationClip);
    return animationAction;
  };

  const getPosition = () => {
    return new THREE.Vector3(
      meshRef.current.position.x,
      meshRef.current.position.y,
      meshRef.current.position.z
    );
  };

  return <mesh ref={meshRef} />;
};

export default NPCLoader;

// import React from 'react';
// import { Canvas } from 'react-three-fiber';
// import * as THREE from 'three';
// import NPCLoader from './NPCLoader';

// const App = () => {
//   // Set up Three.js scene
//   const scene = new THREE.Scene();

//   return (
//     <Canvas
//       camera={{ position: [0, 0, 10], fov: 75 }}
//       onCreated={({ gl }) => {
//         gl.shadowMap.enabled = true;
//         gl.shadowMap.type = THREE.PCFSoftShadowMap;
//       }}
//     >
//       <ambientLight intensity={0.5} />
//       <pointLight position={[10, 10, 10]} />

//       {/* Render NPCs */}
//       <NPCLoader modelPath="path/to/model.fbx" npcName="NPC 1" modelTexturePath="path/to/texture.jpg" scale={1} scene={scene} />
//       <NPCLoader modelPath="path/to/model.fbx" npcName="NPC 2" modelTexturePath="path/to/texture.jpg" scale={1} scene={scene} />
//     </Canvas>
//   );
// };

// export default App;
