import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import Interactibles from "../lib/Interactibles";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader } from "three";
import { StateMachine, IdleState, InteractingState } from "./NPCStates";
import { setNpcs } from "./NPCGetterSetter";
import IdleAnim from "src/assets/models/animations/Idle.fbx";
import WalkingAnim from "src/assets/models/animations/Walking.fbx";
import TalkingAnim from "src/assets/models/animations/Talking.fbx";

import {
  addNpcToTable,
  addDialogToTable,
  viewNpcData,
  viewDialogData,
  viewQuestById,
  fetchNpcQuestStatus,
} from "../db/HandleTable";

export default class NPCLoader extends Interactibles {
  constructor() {
    super();
    this.mesh = undefined;
    this.actions = [];
    this.stateMachine = new StateMachine(new IdleState(this));
    // Set the default rotation angle (in radians)
    // this.defaultRotationAngle = Math.PI / 2; // Example: 90 degrees
    this.dialogContainer = document.getElementById("npc-dialog");
    this.rayLength = 0.02;
  }

  initialize(
    scene,
    position,
    camera,
    player,
    canvas,
    groundMesh,
    rotation,
    modelPath,
    npcName,
    scale,
    destination = null,
    modelTexturePath = null
  ) {
    super.initialize(position, camera, player);
    this.scene = scene;
    this.groundMesh = groundMesh;
    this.canvas = document.getElementById(canvas);
    this.position.set(position.x, position.y, position.z);
    this.textureLoader = new TextureLoader();
    this.modelPath = modelPath;
    this.npcName = npcName;
    this.loadModel(modelPath, npcName, modelTexturePath, scale);
    this.stateMachine.currentState.enter();
    this.defaultRotationAngle = rotation;
    this.defaultRotation = rotation;
    this.transitionedToIdle = false;
    this.transitionedToInteracting = false;
    this.isTalking = false;
    this.dialogShown = false;
    this.isFinishedTyping = false;
    this.player = player;
    this.height = 5;
    this.camera = camera;
    this.direction = new THREE.Vector3(0, 0, 0);
    this.name = npcName;
    this.isLoaded = false;

    this.currentQuestStatus = {
      stats: "",
      get questStatus() {
        return this.stats;
      },
      set questStatus(val) {
        this.stats = val;
      },
    };

    this.currentQuest = {
      data: null,
      get npcData() {
        return this.data;
      },
      set npcData(val) {
        this.data = val;
      },
    };

    this.distanceDisplay = {
      shown: false,
      set shownDistance(val) {
        this.shown = val;
      },
    };

    // Set Dynamic Npc name label
    this.dynamicLabel.setNpcNameLabel({
      text: npcName,
      camera: camera,
      position: this.getNameLabelPosition(),
    });
    this.nameLabelYOffset = 6;
    this.dynamicLabel.showNpcNameLabel(this.getNameLabelPosition(), camera);
    this.npcNameDisplayRange = 30;

    this.movementSpeed = 6;
    this.startPoint = position;
    this.endPoint = destination;

    this.goingForward = true;
    this.isGrounded = true;

    this.collisionBox = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 5, 1.5),
      new THREE.MeshBasicMaterial({ visible: false }) // Make the collision box invisible
    );
    this.scene.add(this.collisionBox);
    this.playerId = localStorage.getItem("playerId");

    async function fetchNpcQuest(quest_id, npc_id) {
      try {
        console.log("QUEST ID: " + quest_id, "NPC_ID: " + npc_id);
        const questData = await viewQuestById(quest_id);
        this.currentQuest.data = questData[0];

        fetchNpcQuestStatus(npc_id, this.playerId)
          .then((result) => {
            this.setQuestIcon(
              this.currentQuest.data.quest_type,
              result[0].quest_status
              // result.playerQuestData.quest_status
            );
            this.currentQuestStatus.stats = result[0].quest_status;
            // this.currentQuestStatus.stats = result.playerQuestData.quest_status;
          })
          .catch((err) => {
            console.log("Setting Quest Icon: ", err);
          });
      } catch (error) {
        console.log("fetchNpcQuest, NPCLoader.js: ", error);
      }
    }

    async function fetchData(npcName) {
      try {
        this.npcData = await viewNpcData(npcName, this.playerId);
        if (this.npcData[0]) {
          console.log("THIS NPC DATA: ", this.npcData);
          // if (this.npcData[0].quest_status !== "locked") {
          //   if (this.npcData[0].quest_status !== "completed") {
          if (this.npcData[0].quest_id) {
            this.hasQuest = true;
            fetchNpcQuest.call(
              this,
              this.npcData[0].quest_id,
              this.npcData[0].npc_id
            );
          }
          // REMINDER: CHANGE HOW THE NPC IS BEING DETECTED OF DIALOG
          if (this.npcData[0].dialog_id) {
            this.hasDialog = true;
          } else {
            this.hasDialog = false;
          }
          //   }
          // }
        }
      } catch (error) {
        console.error("[ERROR]:", error);
      }
    }

    fetchData.call(this, npcName);
    setNpcs(this);
  }

  update(delta) {
    super.update(delta);
    if (this.mixer) {
      this.mixer.update(delta);
      this.stateMachine.update();
      TWEEN.update();
      this.collisionBox.position.set(
        this.position.x,
        this.position.y,
        this.position.z
      );
      this.npcbox = new THREE.Box3().setFromObject(this.collisionBox);
      if (this.endPoint) {
        this.moveToDestination(this.startPoint, this.endPoint, delta);
      }
      this.updateAnimation();
      this.updatePositionToGround(delta);
      this.updateFloatingName();

      if (this.player.interactingWithNpc === this.npcName) {
        this.rotateTowards(this.player.getPosition());
        this.isTalking = true;
      } else {
        this.isTalking = false;
      }
    }
  }

  updateFloatingName() {
    if (this.npcNearPlayer(this.npcNameDisplayRange) && this.inCameraView()) {
      this.dynamicLabel.showNpcNameLabel(
        this.getNameLabelPosition(),
        this.camera
      );
    } else {
      this.dynamicLabel.hideNpcNameLabel();
    }
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
    this.position.set(
      this.mesh.position.x,
      this.mesh.position.y,
      this.mesh.position.z
    );
    const lerpFactor = 0.1; // Adjust the lerp factor to control the speed of interpolation

    if (groundHeight !== null) {
      const reachableHeight = groundHeight + this.height / 2;
      // follow ground height
      if (this.mesh.position.y <= reachableHeight) {
        this.mesh.position.y = groundHeight;
        // this.position.lerp(targetPosition, lerpFactor);
        this.position.y = this.mesh.position.y;
        this.isGrounded = true;
      } else {
        // if the ground is too low
        this.mesh.position.y -= 9.81 * deltaTime;
        // this.position.lerp(this.mesh.position, lerpFactor);
        this.position.y = this.mesh.position.y;
        this.isGrounded = false;
      }
    } else {
      // if there is no ground
      // this.mesh.position.y -= 9.81 * deltaTime;
      // this.position.y = this.mesh.position.y;
      // this.direction.y -= 9.81 * deltaTime;
      // this.isGrounded = false;
    }
  }

  moveToDestination(startPoint, endPoint, delta) {
    let distance;
    if (this.goingForward) {
      this.direction = endPoint.clone().sub(startPoint).normalize();
      distance = this.mesh.position.distanceTo(endPoint);

      if (distance < endPoint.distanceTo(startPoint)) {
        if (this.goingForward) {
          this.direction = new THREE.Vector3(0, 0, 0);
          setTimeout(() => {
            this.goingForward = false;
          }, 3000);
        }
      }

      // if (distance < 2) {
      //   if (this.goingForward) {
      //     this.direction = new THREE.Vector3(0, 0, 0);
      //     setTimeout(() => {
      //       this.goingForward = false;
      //     }, 3000);
      //   }
      // }
    } else {
      this.direction = startPoint.clone().sub(endPoint).normalize();
      distance = this.mesh.position.distanceTo(startPoint);

      if (distance > endPoint.distanceTo(startPoint)) {
        if (!this.goingForward) {
          this.direction = new THREE.Vector3(0, 0, 0);
          setTimeout(() => {
            this.goingForward = true;
          }, 3000);
        }
      }

      // if (distance < 2) {
      //   if (!this.goingForward) {
      //     this.direction = new THREE.Vector3(0, 0, 0);
      //     setTimeout(() => {
      //       this.goingForward = true;
      //     }, 3000);
      //   }
      // }
    }

    if (this.isTalking) {
      this.direction = new THREE.Vector3(0, 0, 0);
    }

    if (this.direction.x !== 0 || this.direction.z !== 0) {
      const movement = this.direction
        .clone()
        .multiplyScalar(this.movementSpeed * delta);
      const newPosition = this.mesh.position.clone().add(movement);

      this.mesh.position.copy(newPosition);
      const angle = Math.atan2(this.direction.x, this.direction.z);
      const rotateModelToAngle = (targetAngle) => {
        let adjustedAngle = targetAngle;
        if (adjustedAngle - this.mesh.rotation.y > Math.PI) {
          adjustedAngle -= Math.PI * 2;
        } else if (this.mesh.rotation.y - adjustedAngle > Math.PI) {
          adjustedAngle += Math.PI * 2;
        }
        new TWEEN.Tween(this.mesh.rotation)
          .to({ y: adjustedAngle }, 80)
          .start();
      };
      rotateModelToAngle(angle);
      // this.mesh.rotation.y = angle;
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
      } else {
        if (this.fallingAction) {
          this.currentAction = this.fallingAction;
        }
      }
    } else {
      if (this.idleAction) {
        this.currentAction = this.idleAction;
      }
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

  talkToPlayer(talking = false, targetPosition) {
    if (talking) {
      this.isInteracting = true;
      this.rotateTowards(targetPosition);
      this.transitionedToIdle = false;
      if (!this.transitionedToInteracting) {
        this.stateMachine.transitionTo(new InteractingState(this));
        this.transitionedToInteracting = true;
        if (this.talkingAction) {
          this.currentAction = this.talkingAction;
          this.showDialog();
        }
      }
    } else {
      this.isInteracting = false;
      this.rotateTowards(targetPosition);
      this.hideDialog();
      this.backToIdle();
    }
  }

  backToIdle() {
    this.transitionedToInteracting = false;
    if (!this.transitionedToIdle) {
      this.stateMachine.transitionTo(new IdleState(this));
      this.transitionedToIdle = true;
      if (this.idleAction) {
        this.currentAction = this.idleAction;
      }
    }
  }

  rotateTowards(targetPosition) {
    if (this.mesh) {
      var rotationSpeed = 100;
      var direction = new THREE.Vector3()
        .subVectors(targetPosition, this.mesh.position)
        .normalize();
      var angle = Math.atan2(direction.x, direction.z);
      new TWEEN.Tween(this.mesh.rotation)
        .to({ y: angle }, rotationSpeed)
        .start();
    }
  }

  getNameLabelPosition() {
    return new THREE.Vector3(
      this.position.x,
      this.position.y + this.nameLabelYOffset,
      this.position.z
    );
  }

  loadModel(modelPath, npcName, modelTexturePath, scale) {
    const loadingManager = new THREE.LoadingManager();
    loadingManager.setURLModifier(function (url) {
      if (
        url ===
        "/src/assets/models/raphtalia/D:/on sell/Character/raphtalia/texture/body.png"
      ) {
        url = "/src/assets/models/raphtalia/texture/body.png";
      }
      if (
        url ===
        "/src/assets/models/raphtalia/D:/on sell/Character/raphtalia/texture/mata.png"
      ) {
        url = "/src/assets/models/raphtalia/texture/mata.png";
      }
      return url;
    });
    // this.fbxLoader = new FBXLoader(loadingManager);
    this.fbxLoader = new FBXLoader();

    this.animationsPath = "/src/assets/models/animations/";
    this.fbxLoader.load(
      modelPath,
      (fbx) => {
        fbx.position.set(this.position.x, this.position.y, this.position.z);
        fbx.scale.set(scale, scale, scale);

        const baseTexture = new THREE.TextureLoader().load(
          modelTexturePath,
          (texture) => {
            this.isLoaded = true;
          }
        );
        const baseMaterial = new THREE.MeshBasicMaterial({ map: baseTexture });

        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = baseMaterial;
            child.material.visible = true;
            child.material.side = THREE.DoubleSide;
            child.material.opacity = 1.0;
            child.material.transparent = false;
            child.material.blending = THREE.NoBlending;
            child.material.alphaMap = null;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        // fbx.rotation.y = Math.PI / 2;
        fbx.name = npcName;
        this.scene.add(fbx);
        this.mesh = fbx;

        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.initAction = this.actionClipAnimation(fbx, scale);
        this.mesh.rotation.y = this.defaultRotation;
        this.initAction.name = "init";
        // this.actions.push(this.initAction);
        this.initAction.paused = false;
        this.initAction.play();

        this.loadAnimation(this.animationsPath);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }
  loadAnimation(animationPath) {
    this.fbxLoader.load(IdleAnim, (fbx) => {
      this.idleAction = this.actionClipAnimation(fbx, this.mixer);
      this.idleAction.name = "Idle";
      this.actions.push(this.idleAction);
    });
    this.fbxLoader.load(TalkingAnim, (fbx) => {
      this.talkingAction = this.actionClipAnimation(fbx, this.mixer);
      this.talkingAction.name = "Talking";
      this.actions.push(this.talkingAction);
    });
    this.fbxLoader.load(WalkingAnim, (fbx) => {
      this.walkingAction = this.actionClipAnimation(fbx, this.mixer);
      this.walkingAction.name = "Walking";
      this.actions.push(this.walkingAction);
    });
  }
  actionClipAnimation(fbx, scale) {
    fbx.scale.set(scale, scale, scale);
    const animationClip = fbx.animations[0];
    const animationAction = this.mixer.clipAction(animationClip);
    return animationAction;
  }
}
