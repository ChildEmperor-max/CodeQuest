import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as TWEEN from "@tweenjs/tween.js";
import keys from "../lib/KeyControls";
import ManageLoader from "../lib/Loader";
import IdleAnim from "src/assets/models/animations/Idle.fbx";
import WalkingAnim from "src/assets/models/animations/Walking.fbx";
import RunningAnim from "src/assets/models/animations/Running.fbx";
import VictoryAnim from "src/assets/models/animations/Victory.fbx";
import DefeatAnim from "src/assets/models/animations/Defeat.fbx";
import FallingAnim from "src/assets/models/animations/Falling.fbx";
import PlayerModel from "src/assets/player/m/Idle.fbx";
import BlueTexture from "src/assets/player/m/Peasant Nolant Blue.png";

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
    this.isTalkingToNpc = false;
    this.onTransferArea = false;
    this.transferArea = null;
    this.currentSpeed = 0;
    this.isDoneLoading = false;
    this.movingDirection = "flat";
    this.jumpDistance = 0;
    this.loaderElement = null;
    this.textLoaderElement = null;
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
    this.walkingSpeed = 15;
    this.movementSpeed = this.walkingSpeed;
    this.runningSpeed = 50;
    // this.runningSpeed = 30;
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
    this.nearNpcs = [];
    this.updatedNearNpc = false;

    this.previousPlayerY = this.position.y;

    this.runningIcon = document.getElementById("sprint-icon");
    this.runningIcon.addEventListener("click", function () {
      keys.shift.justPressed = !keys.shift.justPressed;
    });
  }

  update(delta, npcs, currentDelta) {
    this.npcs = npcs;
    if (this.mesh) {
      if (this.walkables) {
        this.movement(delta);
      }
      this.updateAnimation();
      this.motion(delta);
      this.updatePlayerNpcCollisionMesh();
      this.mixer.update(delta);
      TWEEN.update();
      // Set the position of the collision box
      this.collisionBox.position.set(
        this.position.x,
        this.position.y,
        this.position.z
      );
      if (this.raycasterVisuals > 0) {
        this.updateRaycasterVisuals();
      }
      if (this.nearNpcs.length > 0) {
        if (!this.updatedNearNpc) {
          this.updatePlayerNearNpc(true);
          this.updatedNearNpc = true;
        }
      } else {
        if (this.updatedNearNpc) {
          this.updatePlayerNearNpc(false);
          this.updatedNearNpc = false;
        }
      }
      // currentDelta += delta;
      // if (currentDelta > 1 / 10) {
      setTimeout(() => {
        this.onNpcZone(this.nearNpcs[this.nearNpcs.length - 1]);
      }, 1000);
      //   currentDelta = (currentDelta % 1) / 10;
      // }
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
      this.isTalkingToNpc = false;
    } else {
      this.isTalkingToNpc = false;
      this.updatePlayerInteractNpc(null);
    }
  }

  getNearNpcName() {
    return this.interactingWithNpc;
  }

  updatePlayerNearNpc(npc) {
    const event = new CustomEvent("playerNearNpc", {
      detail: npc,
    });
    document.dispatchEvent(event);
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

  npcInteractionDetection(npc, npcBox) {
    if (this.npcDetectionBox.intersectsBox(npcBox)) {
      npc.isInteractable();
    } else {
      npc.hideInteractLabel();
    }
  }

  motion(delta) {
    if (this.direction.x !== 0 || this.direction.z !== 0) {
      const currentPlayerY = this.position.y;

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
      this.npcDetectionBox = new THREE.Box3().setFromObject(
        this.playerNpcInteractCollisionMesh
      );
      if (this.playerbox) {
        if (this.npcs) {
          for (let i = 0; i < this.npcs.length; i++) {
            if (this.npcs[i].npcbox) {
              this.boxCollision(this.npcs[i].npcbox, newPosition);
              // this.npcInteractionDetection(this.npcs[i], this.npcs[i].npcbox);
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

  updatePlayerNpcCollisionMesh() {
    if (this.mesh) {
      this.playerNpcInteractCollisionMesh.position.copy(
        new THREE.Vector3(
          this.getPosition().x,
          this.getPosition().y + 3,
          this.getPosition().z
        )
      );
    }
  }

  loadModel(scene) {
    // this.modelScale = 0.03;
    // const loadingManager = new THREE.LoadingManager();
    const loader = new ManageLoader(
      "Loading Player ...",
      this.loaderElement,
      this.textLoaderElement
    );

    this.fbxLoader = new FBXLoader(loader.loadingManager);
    const animationsPath = "/src/assets/models/animations/";
    // const playerModelPath = "/src/assets/player/m/";
    this.fbxLoader.load(
      PlayerModel,
      (fbx) => {
        fbx.position.set(this.position.x, this.position.y, this.position.z);
        fbx.scale.set(this.modelScale, this.modelScale, this.modelScale);
        const playerCollisionGeometry = new THREE.BoxBufferGeometry(6, 6, 6);
        this.playerNpcInteractCollisionMesh = new THREE.Mesh(
          playerCollisionGeometry,
          new THREE.MeshBasicMaterial({ visible: false })
        );
        const textureTest = new THREE.TextureLoader().load(BlueTexture);
        const materialTest = new THREE.MeshBasicMaterial({ map: textureTest });

        // children[1].material.map.image.currentSrc
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // child.material.specular = new THREE.Color(0xffffff);
            child.material = materialTest;
            child.castShadow = true;
            child.receiveShadow = true;
            child.material.visible = true;
            child.material.side = THREE.DoubleSide;
            child.material.opacity = 1.0;
            child.material.transparent = false;
            child.material.blending = THREE.NoBlending;
            child.material.alphaMap = null;

            // if (child.morphTargetInfluences !== undefined) {
            //   var outlineMaterial1 = new THREE.MeshBasicMaterial({
            //     color: 0xff0000,
            //     side: THREE.BackSide,
            //   });
            //   var outlineMesh1 = new THREE.Mesh(
            //     child.geometry,
            //     outlineMaterial1
            //   );
            //   outlineMesh1.position = child.position;
            //   outlineMesh1.scale.multiplyScalar(1.05);
            //   scene.add(outlineMesh1);
            // }
          }
        });

        // fbx.rotation.y = Math.PI / 2;
        fbx.name = "Player";
        scene.add(fbx);
        scene.add(this.playerNpcInteractCollisionMesh);
        this.mesh = fbx;

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
    this.fbxLoader.load(IdleAnim, (idleFbx) => {
      this.idleAction = this.actionClipAnimation(idleFbx, mixer);
      this.idleAction.name = "idle";
      this.actions.push(this.idleAction);
    });

    this.fbxLoader.load(WalkingAnim, (walkingFbx) => {
      this.walkingAction = this.actionClipAnimation(walkingFbx, mixer);
      this.walkingAction.name = "walking";
      this.actions.push(this.walkingAction);
    });

    this.fbxLoader.load(RunningAnim, (runningFbx) => {
      this.runningAction = this.actionClipAnimation(runningFbx, mixer);
      this.runningAction.name = "running";
      this.actions.push(this.runningAction);
    });

    this.fbxLoader.load(FallingAnim, (fallingFbx) => {
      this.fallingAction = this.actionClipAnimation(fallingFbx, mixer);
      this.fallingAction.name = "falling";
      this.actions.push(this.fallingAction);
    });

    this.fbxLoader.load(DefeatAnim, (defeatFbx) => {
      this.defeatAction = this.actionClipAnimation(defeatFbx, mixer);
      this.defeatAction.name = "defeat";
      this.actions.push(this.defeatAction);
    });

    this.fbxLoader.load(VictoryAnim, (victoryFbx) => {
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
