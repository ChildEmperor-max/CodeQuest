import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as TWEEN from "@tweenjs/tween.js";
import QuestManager from "../lib/QuestManager";
import keys from "../lib/KeyControls";
import Loader from "../lib/Loader";

export default class Player extends THREE.Object3D {
  constructor() {
    super();
    this.name = "Player";
    this.mesh = undefined;
    this.rayY = 1;
    this.rayLength = 0.02;
    this.collisionRays = [
      new THREE.Vector3(0, this.rayY, this.rayLength),
      new THREE.Vector3(this.rayLength, this.rayY, this.rayLength),
      new THREE.Vector3(this.rayLength, this.rayY, 0),
      new THREE.Vector3(this.rayLength, this.rayY, -this.rayLength),
      new THREE.Vector3(0, this.rayY, -this.rayLength),
      new THREE.Vector3(-this.rayLength, this.rayY, -this.rayLength),
      new THREE.Vector3(-this.rayLength, this.rayY, 0),
      new THREE.Vector3(-this.rayLength, this.rayY, this.rayLength),
    ];
    this.raycastCollideDirection = new THREE.Vector3(0, -this.rayLength, 0);
    this.caster = new THREE.Raycaster();
    this.direction = new THREE.Vector3(0, 0, 0);
    this.directionTracker = new THREE.Vector3(0, 0, 0);
    this.positionTracker = new THREE.Vector3(0, 0, 0);
    this.obstacles = [];
    this.actions = [];
    this.questsList = [];
    this.running = false;
    this.groundMesh = undefined;
    this.collisionBox = undefined;
    this.questManager = new QuestManager();
    this.isTalkingToNpc = false;
    this.onTransferArea = false;
    this.transferArea = null;
    this.currentSpeed = 0;
    this.isDoneLoading = false;
    this.movingDirection = "flat";
    this.jumpDistance = 0;
  }

  initialize(
    scene,
    camera,
    position,
    obstacles,
    walkables,
    groundMesh,
    transferAreas
  ) {
    this.scene = scene;
    this.walkingSpeed = 10;
    this.movementSpeed = this.walkingSpeed;
    this.runningSpeed = 20;
    this.modelScale = 0.01;
    this.loadModel(scene);
    this.position.set(position.x, position.y, position.z);
    this.obstacles = obstacles;
    this.walkables = walkables;
    this.height = 5;
    this.camera = camera;
    // this.add(camera);
    this.groundMesh = groundMesh;
    this.transferAreas = transferAreas;
    this.raycastCollidables = new THREE.Raycaster(
      new THREE.Vector3(position.x, position.y, position.z),
      this.raycastCollideDirection
    );

    this.collisionBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 5, 1.5),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    scene.add(this.collisionBox);

    //flags
    this.isGrounded = true;
    this.questListShown = false;
    this.enableNpcDetection = true;
    this.isRunning = false;
    this.interactingWithNpc = null;

    this.previousPlayerY = this.position.y;

    this.runningIcon = document.getElementById("sprint-icon");
    this.runningIcon.addEventListener("click", function () {
      keys.shift.justPressed = !keys.shift.justPressed;
    });
  }

  raycasterDebug(from_vec3) {
    this.raycasterVisuals = [];
    this.raycasterColors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];

    const raycaster = this.raycastCollidables;

    // Create a line representing the raycaster
    const raycasterGeometry = new THREE.BufferGeometry().setFromPoints([
      raycaster.ray.origin.clone(), // Starting point of the ray
      raycaster.ray.origin
        .clone()
        .add(raycaster.ray.direction.clone().multiplyScalar(10)), // Ending point of the ray
    ]);

    const raycasterMaterial = new THREE.LineBasicMaterial({
      color: this.raycasterColors[0],
    });
    const raycasterLine = new THREE.Line(raycasterGeometry, raycasterMaterial);
    this.raycasterVisuals.push(raycasterLine);

    // Add the raycaster visual to the scene
    this.scene.add(raycasterLine);
  }

  updateRaycasterVisuals() {
    // for (let i = 0; i < raycasters.length; i++) {
    const raycaster = this.raycastCollidables;
    const raycasterLine = this.raycasterVisuals[0];

    // Set the position and rotation of the raycaster visual to match this.mesh
    raycasterLine.position.copy(this.mesh.position);
    raycasterLine.rotation.copy(this.mesh.rotation);

    // Apply the raycaster's local direction to the visual
    const direction = raycaster.ray.direction.clone();
    direction.applyQuaternion(this.mesh.quaternion);
    raycasterLine.geometry.setFromPoints([
      raycasterLine.position.clone(),
      raycasterLine.position.clone().add(direction.multiplyScalar(10)),
    ]);
    // }
  }

  update(delta, npcs) {
    this.npcs = npcs;
    if (this.mesh) {
      if (this.walkables) {
        this.movement(delta);
      }
      this.updateAnimation();
      this.motion(delta);
      this.mixer.update(delta);
      TWEEN.update();
      // Set the position of the collision box
      this.collisionBox.position.set(
        this.position.x,
        this.position.y,
        this.position.z
      );
      // if (this.raycasterVisuals > 0) {
      //   this.updateRaycasterVisuals();
      // }
    }
    // this.updateQuestVisibility();
  }
  updateQuestVisibility() {
    if (keys.q.justPressed) {
      if (!this.questListShown) {
        this.questManager.toggleQuestBox();
        this.questListShown = true;
      }
    } else {
      if (this.questListShown) {
        this.questManager.toggleQuestBox();
        this.questListShown = false;
      }
    }
  }

  onNpcZone(npc) {
    if (npc) {
      if (keys.e.pressed) {
        if (!this.isTalkingToNpc) {
          this.isTalkingToNpc = true;
          this.rotateTowards(npc.position);
          this.updatePlayerInteractNpc(npc);
        }
      }
    } else {
      this.isTalkingToNpc = false;
      this.updatePlayerInteractNpc(null);
    }
  }

  getNearNpcName() {
    return this.interactingWithNpc;
  }

  updatePlayerInteractNpc(npc) {
    if (npc) {
      this.interactingWithNpc = npc.npcName;
    } else {
      this.interactingWithNpc = null;
    }
    const event = new CustomEvent("playerInteractNpc", {
      detail: npc,
    });
    document.dispatchEvent(event);
  }

  // updateNpcDetection(npcs) {
  //   var npcDetectionShape = new THREE.Sphere(this.position, 5);
  //   for (var i = 0; i < npcs.length; i++) {
  //     var npc = npcs[i];
  //     var npcPosition = new THREE.Vector3();
  //     npc.getWorldPosition(npcPosition);

  //     var collided = npcDetectionShape.containsPoint(npcPosition);

  //     if (collided) {
  //       if (!npc.isTalking) {
  //         this.textManager.showText(npcPosition);
  //       }
  //       if (keys.e.pressed) {
  //         npc.talkToPlayer(true, this.position);
  //         this.rotateTowards(npc.position);
  //         this.enableNpcDetection = false;
  //         if (!this.isTalkingToNpc) {
  //           this.isTalkingToNpc = true;
  //         }
  //       }
  //     } else {
  //       if (!this.enableNpcDetection) {
  //         this.enableNpcDetection = true;
  //       }
  //       if (this.isTalkingToNpc) {
  //         this.isTalkingToNpc = false;
  //         npc.talkToPlayer(false, npc.defaultRotation);
  //       }
  //     }
  //   }
  // }

  rotateTowards(targetPosition) {
    if (this.mesh) {
      var rotationSpeed = 100;
      var direction = new THREE.Vector3()
        .subVectors(targetPosition, this.mesh.position)
        .normalize();
      var angle = Math.atan2(direction.x, direction.z);

      // Calculate the shortest rotation angle between the current and target angles
      var currentAngle = this.mesh.rotation.y;
      var shortestAngle = Math.atan2(
        Math.sin(angle - currentAngle),
        Math.cos(angle - currentAngle)
      );
      var targetAngle = currentAngle + shortestAngle;

      // Use a Tween to smoothly interpolate between the current and target angles
      new TWEEN.Tween(this.mesh.rotation)
        .to({ y: targetAngle }, rotationSpeed)
        .start();
    }
  }

  boxCollision(box_to_collide, newPosition) {
    if (this.playerbox.intersectsBox(box_to_collide)) {
      let rightSide = Math.abs(this.playerbox.min.x - box_to_collide.max.x);
      let leftSide = Math.abs(this.playerbox.max.x - box_to_collide.min.x);
      let frontSide = Math.abs(this.playerbox.max.z - box_to_collide.min.z);
      let backSide = Math.abs(this.playerbox.min.z - box_to_collide.max.z);

      let minDistance = Math.min(rightSide, leftSide, frontSide, backSide);

      if (minDistance === rightSide) {
        if (this.direction.x < 0) {
          newPosition.x = this.mesh.position.x;
        }
      } else if (minDistance === leftSide) {
        if (this.direction.x > 0) {
          newPosition.x = this.mesh.position.x;
        }
      } else if (minDistance === frontSide) {
        if (this.direction.z > 0) {
          newPosition.z = this.mesh.position.z;
        }
      } else if (minDistance === backSide) {
        if (this.direction.z < 0) {
          newPosition.z = this.mesh.position.z;
        }
      }
      this.directionTracker.set(0, 0, 0);
    }
  }

  areaDetection(areaCollisionBox, areaObject) {
    if (this.playerbox.intersectsBox(areaCollisionBox)) {
      this.onTransferArea = true;
      this.transferArea = areaObject;
    } else {
      this.onTransferArea = false;
      this.transferArea = null;
    }
  }

  movement(delta) {
    const cameraDirection = new THREE.Vector3();
    this.camera.getWorldDirection(cameraDirection);

    // Remove y component to only move along x and z axis
    cameraDirection.y = 0;
    cameraDirection.normalize();
    const perpendicularCamera = new THREE.Vector3(
      -cameraDirection.z,
      0,
      cameraDirection.x
    );

    this.direction.set(0, 0, 0); // Reset the direction vector

    if (keys.w.pressed) {
      this.direction.addScaledVector(cameraDirection, 1);
    }
    if (keys.s.pressed) {
      this.direction.addScaledVector(cameraDirection, -1);
    }
    if (keys.a.pressed) {
      this.direction.addScaledVector(perpendicularCamera, -1);
    }
    if (keys.d.pressed) {
      this.direction.addScaledVector(perpendicularCamera, 1);
    }
    if (keys.shift.justPressed) {
      this.runningMode(true);
    } else {
      this.runningMode(false);
    }

    this.updatePositionToGround(delta);
    this.direction.normalize();
    this.directionTracker.copy(this.direction);
  }

  motion(delta) {
    if (this.direction.x !== 0 || this.direction.z !== 0) {
      const currentPlayerY = this.position.y;

      // const targetPosition = new THREE.Vector3(
      //   0,
      //   groundHeight,
      //   0
      // );
      // const lerpFactor = 0.08;
      // this.positionTracker.lerp(targetPosition, lerpFactor);

      // Compare with the previous frame's Y-coordinate to determine movement direction
      if (Math.trunc(currentPlayerY) == Math.trunc(this.previousPlayerY)) {
        this.movingDirection = "flat";
        this.jumpDistance = 0;
      }
      if (currentPlayerY > this.previousPlayerY + 0.1) {
        this.movingDirection = "up";
        this.jumpDistance = currentPlayerY - this.previousPlayerY;
      }
      if (currentPlayerY < this.previousPlayerY - 0.1) {
        this.movingDirection = "down";
        this.jumpDistance = currentPlayerY - this.previousPlayerY;
      }

      // Update the previous Y-coordinate for the next frame
      this.previousPlayerY = currentPlayerY;

      const movement = this.direction
        .clone()
        .multiplyScalar(this.movementSpeed * delta);
      const newPosition = this.mesh.position.clone().add(movement);

      this.playerbox = new THREE.Box3().setFromObject(this.collisionBox);
      if (this.playerbox) {
        if (this.npcs) {
          for (let i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].npcbox) {
              this.boxCollision(this.npcs[i].npcbox, newPosition);
            }
          }
        }
      }
      if (this.obstacles) {
        this.obstacles.forEach((collisionObject) => {
          if (!collisionObject.name.startsWith("Floor")) {
            const boundingBox = new THREE.Box3().setFromObject(collisionObject);
            this.boxCollision(boundingBox, newPosition);
          }
        });
      }
      if (this.transferAreas) {
        this.transferAreas.forEach((object) => {
          const boundingBox = new THREE.Box3().setFromObject(object);
          this.areaDetection(boundingBox, object);
        });
      }
      this.mesh.position.copy(newPosition);
      const angle = Math.atan2(this.direction.x, this.direction.z);

      // const rotateModelToAngle = (targetAngle) => {
      //   let adjustedAngle = targetAngle;
      //   if (adjustedAngle - this.mesh.rotation.y > Math.PI) {
      //     adjustedAngle -= Math.PI * 2;
      //   } else if (this.mesh.rotation.y - adjustedAngle > Math.PI) {
      //     adjustedAngle += Math.PI * 2;
      //   }
      //   new TWEEN.Tween(this.mesh.rotation)
      //     .to({ y: adjustedAngle }, 80)
      //     .start();
      // };
      // rotateModelToAngle(angle);
      this.mesh.rotation.y = angle;
      this.position.set(
        this.mesh.position.x,
        this.mesh.position.y,
        this.mesh.position.z
      );

      if (this.isGrounded) {
        if (this.walkingAction) {
          this.currentAction = this.walkingAction;
          if (this.running) {
            this.currentAction = this.runningAction;
          }
        }
      }
    } else {
      this.currentSpeed = 0;
      keys.shift.justPressed = false;
      if (this.idleAction) {
        this.currentAction = this.idleAction;
      }
    }
    if (!this.isGrounded) {
      if (this.fallingAction) {
        this.currentAction = this.fallingAction;
      }
    }
    if (keys.space.justPressed) {
      this.currentAction = this.victoryAction;
    }
  }

  runningMode(isRunning) {
    this.running = isRunning;
    if (this.running) {
      this.movementSpeed = this.runningSpeed;
    } else {
      this.movementSpeed = this.walkingSpeed;
    }
    this.currentSpeed = this.movementSpeed;

    this.updatePlayerInstanceRunning(isRunning);
  }

  updatePlayerInstanceRunning(newValue) {
    if (this.isRunning !== newValue) {
      this.isRunning = newValue;

      // Dispatch a custom event only when the value changes
      const event = new CustomEvent("playerInstanceRunningChanged", {
        detail: newValue,
      });
      document.dispatchEvent(event);
    }
  }

  updateAnimation() {
    this.actions.forEach((action) => {
      if (action) {
        if (action !== this.currentAction) {
          action.paused = true;
          action.reset();
          action.fadeIn(100);
        } else {
          action.paused = false;
          action.play();
          action.fadeOut(100);
        }
      }
    });
  }

  findIntersectionHeight(from_vec3, object_to_intersect) {
    const raycastGround = new THREE.Raycaster(
      new THREE.Vector3(from_vec3.x, from_vec3.y + 2, from_vec3.z),
      new THREE.Vector3(0, -this.rayLength, 0)
    );

    let intersectionHeight = null;
    const intersectsGround = raycastGround.intersectObject(object_to_intersect);
    if (intersectsGround.length > 0) {
      const intersectedObject = intersectsGround[0].object;
      intersectionHeight = intersectsGround[0].point.y;
    }

    return intersectionHeight;
  }

  updatePositionToGround(deltaTime) {
    const groundHeight = this.findIntersectionHeight(
      this.mesh.position,
      this.groundMesh
    );
    const targetPosition = new THREE.Vector3(
      this.mesh.position.x,
      groundHeight,
      this.mesh.position.z
    );
    const lerpFactor = 0.08;

    if (groundHeight !== null) {
      const reachableHeight = groundHeight + this.height / 2;
      // follow ground height
      if (this.mesh.position.y <= reachableHeight) {
        this.mesh.position.y = groundHeight;
        this.positionTracker.lerp(targetPosition, lerpFactor);
        this.position.lerp(targetPosition, 0.5);
        // this.position.y = this.mesh.position.y;
        this.isGrounded = true;
      } else {
        // if the ground is too low
        this.mesh.position.y -= 9.81 * deltaTime;
        // this.position.lerp(this.mesh.position, lerpFactor);
        this.position.y = this.mesh.position.y;
        this.direction.y -= 9.81 * deltaTime;
        this.direction.y = Math.max(0, this.direction.y);
        this.isGrounded = false;
      }
    } else {
      // if there is no ground
      // this.mesh.position.y -= 9.81 * deltaTime;
      // this.position.y = this.mesh.position.y;
      // this.direction.y -= 9.81 * deltaTime;
      // this.isGrounded = false;
    }

    this.position.add(this.direction.clone().multiplyScalar(deltaTime));
  }

  isMoving() {
    return this.currentSpeed !== 0;
  }

  getPosition() {
    return new THREE.Vector3(this.position.x, this.position.y, this.position.z);
  }

  getPositionTracker() {
    return new THREE.Vector3(
      this.position.x,
      this.positionTracker.y,
      this.position.z
    );
  }

  loadModel(scene) {
    // this.modelScale = 0.01;
    // const loadingManager = new THREE.LoadingManager();
    // loadingManager.setURLModifier(function (url) {
    //   if (url === "/src/assets/models/hutao/E:/Downloads/hutao/tex/发.png") {
    //     url = "/src/assets/models/hutao/tex/发.png";
    //   }
    //   if (url === "/src/assets/models/hutao/E:/Downloads/hutao/tex/服.png") {
    //     url = "/src/assets/models/hutao/tex/服.png";
    //   }
    //   if (url === "/src/assets/models/hutao/E:/Downloads/hutao/tex/面.png") {
    //     url = "/src/assets/models/hutao/tex/面.png";
    //   }
    //   return url;
    // });
    const loader = new Loader("Loading Player ...");

    this.fbxLoader = new FBXLoader(loader.loadingManager);

    const animationsPath = "/src/assets/models/animations/";
    const playerModelPath = "/src/assets/player/";
    this.fbxLoader.load(
      playerModelPath + "model.fbx",
      (fbx) => {
        fbx.position.set(this.position.x, this.position.y, this.position.z);
        fbx.scale.set(this.modelScale, this.modelScale, this.modelScale);

        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.specular = new THREE.Color(0xffffff);
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.morphTargetInfluences !== undefined) {
              var outlineMaterial1 = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.BackSide,
              });
              var outlineMesh1 = new THREE.Mesh(
                child.geometry,
                outlineMaterial1
              );
              outlineMesh1.position = child.position;
              outlineMesh1.scale.multiplyScalar(1.05);
              scene.add(outlineMesh1);
            }
          }
        });

        // fbx.rotation.y = Math.PI / 2;
        fbx.name = "Player";
        scene.add(fbx);
        this.mesh = fbx;
        // this.raycasterDebug(this.mesh.position);

        this.mixer = new THREE.AnimationMixer(this.mesh);
        // this.mixer.timeScale = 7.0;

        this.loadAnimation(this.mixer, animationsPath);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }

  loadAnimation(mixer, playerAnimationPath) {
    this.fbxLoader.load(playerAnimationPath + "Idle.fbx", (idleFbx) => {
      this.idleAction = this.actionClipAnimation(idleFbx, mixer);
      this.idleAction.name = "idle";
      this.actions.push(this.idleAction);
    });

    this.fbxLoader.load(playerAnimationPath + "Walking.fbx", (walkingFbx) => {
      this.walkingAction = this.actionClipAnimation(walkingFbx, mixer);
      this.walkingAction.name = "walking";
      this.actions.push(this.walkingAction);
    });

    this.fbxLoader.load(playerAnimationPath + "Running.fbx", (runningFbx) => {
      this.runningAction = this.actionClipAnimation(runningFbx, mixer);
      this.runningAction.name = "running";
      this.actions.push(this.runningAction);
    });

    this.fbxLoader.load(playerAnimationPath + "Falling.fbx", (fallingFbx) => {
      this.fallingAction = this.actionClipAnimation(fallingFbx, mixer);
      this.fallingAction.name = "falling";
      this.actions.push(this.fallingAction);
    });

    this.fbxLoader.load(playerAnimationPath + "Defeat.fbx", (defeatFbx) => {
      this.defeatAction = this.actionClipAnimation(defeatFbx, mixer);
      this.defeatAction.name = "defeat";
      this.actions.push(this.defeatAction);
    });

    this.fbxLoader.load(playerAnimationPath + "Victory.fbx", (victoryFbx) => {
      this.victoryAction = this.actionClipAnimation(victoryFbx, mixer);
      this.victoryAction.name = "victory";
      this.actions.push(this.victoryAction);
    });
  }

  actionClipAnimation(fbx, mixer) {
    fbx.scale.set(this.modelScale, this.modelScale, this.modelScale);
    const animationClip = fbx.animations[0];
    const animationAction = mixer.clipAction(animationClip);
    return animationAction;
  }
}
