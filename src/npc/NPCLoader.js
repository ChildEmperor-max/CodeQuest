import * as THREE from "three";
import * as TWEEN from "@tweenjs/tween.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { TextureLoader } from "three";
import { StateMachine, IdleState, InteractingState } from "./NPCStates";
import QuestManager from "../lib/QuestManager";
import { addNpcToTable, addDialogToTable } from "../db/HandleTable";

export default class NPCLoader extends THREE.Object3D {
  constructor(scene) {
    super();
    this.mesh = undefined;
    this.scene = scene;
    this.actions = [];
    this.stateMachine = new StateMachine(new IdleState(this));
    // Set the default rotation angle (in radians)
    // this.defaultRotationAngle = Math.PI / 2; // Example: 90 degrees
    this.questManager = new QuestManager();
    // this.questManager.initialize();
    this.dialogContainer = document.getElementById("npc-dialog");
    this.rayLength = 0.02;
  }

  initialize(
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
    modelTexturePath = undefined
  ) {
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
  }

  update(delta) {
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
    let direction;
    let distance;
    if (this.goingForward) {
      direction = endPoint.clone().sub(startPoint).normalize();
      distance = this.mesh.position.distanceTo(endPoint);

      if (distance < 2) {
        if (this.goingForward) {
          direction = new THREE.Vector3(0, 0, 0);
          setTimeout(() => {
            this.goingForward = false;
          }, 3000);
        }
      }
    } else {
      direction = startPoint.clone().sub(endPoint).normalize();
      distance = this.mesh.position.distanceTo(startPoint);

      if (distance < 2) {
        if (!this.goingForward) {
          direction = new THREE.Vector3(0, 0, 0);
          setTimeout(() => {
            this.goingForward = true;
          }, 3000);
        }
      }
    }

    if (this.isTalking) {
      direction = new THREE.Vector3(0, 0, 0);
    }

    if (direction.x !== 0 || direction.z !== 0) {
      const movement = direction
        .clone()
        .multiplyScalar(this.movementSpeed * delta);
      const newPosition = this.mesh.position.clone().add(movement);

      this.mesh.position.copy(newPosition);
      const angle = Math.atan2(direction.x, direction.z);
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

  createDialogBox(
    dialogTexts,
    questTitle = undefined,
    hasQuest = false,
    questType,
    codeTemplate,
    questAnswer,
    questStatus
  ) {
    if (questStatus.trim() === "inactive") {
      this.hasQuest = hasQuest;
    } else {
      this.hasQuest = false;
    }
    if (hasQuest) {
      this.quest = dialogTexts[dialogTexts.length - 1];
      this.questTitle = questTitle;
      this.questCodeTemplate = codeTemplate;
      this.questAnswer = questAnswer;
      // this.questManager.initialize();
      //   this.questManager.addQuestItem(
      //     this.quest,
      //     questTitle,
      //     this.npcName,
      //     questType
      //   );
    }

    // addNpc(this.npcName);

    async function addNpc(npcName) {
      try {
        await addDialog(npcName);
        await addNpcToTable(npcName, questTitle, dialogTexts);
        console.log("NPC added to the table");
      } catch (error) {
        console.error("Error adding NPC to the table:", error);
      }
    }

    async function addDialog(npcName) {
      try {
        await addDialogToTable(npcName, dialogTexts, questTitle);
        console.log("Dialog added to the table");
      } catch (error) {
        console.error("Error adding dialog to the table:", error);
        throw error;
      }
    }

    // Create the dialog container
    this.dialogContainer = document.createElement("div");
    this.dialogContainer.classList.add("npc-dialog-container");
    this.dialogContainer.style.zIndex = "9999";

    // Create the dialog text element
    const npcNameElement = document.createElement("div");
    npcNameElement.classList.add("npc-dialog-name");
    npcNameElement.textContent = this.npcName;
    const dialogTextElement = document.createElement("div");
    dialogTextElement.classList.add("npc-dialog-text");
    dialogTextElement.textContent = dialogTexts[0];

    // Create the dialog button elements
    const prevButton = document.createElement("button");
    prevButton.classList.add("npc-dialog-button");
    prevButton.textContent = "Back";
    prevButton.addEventListener("click", this.showPreviousDialog.bind(this));

    const nextButton = document.createElement("button");
    nextButton.classList.add("npc-dialog-button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", this.showNextDialog.bind(this));

    const skipButton = document.createElement("button");
    skipButton.classList.add("npc-dialog-button");
    skipButton.style.display = "none";
    skipButton.textContent = "Skip";

    this.nextButton = nextButton;
    this.prevButton = prevButton;
    this.skipButton = skipButton;

    // Append the elements to the dialog container
    this.dialogContainer.appendChild(npcNameElement);
    this.dialogContainer.appendChild(dialogTextElement);
    this.dialogContainer.appendChild(skipButton);
    this.dialogContainer.appendChild(nextButton);
    this.dialogContainer.appendChild(prevButton);
    this.dialogContainer.style.display = "none";
    document.body.appendChild(this.dialogContainer);
    // this.canvas.appendChild(this.dialogContainer);

    this.acceptQuestHandler = this.acceptQuest.bind(this);
    this.rejectQuestHandler = this.rejectQuest.bind(this);
    this.showNextDialogHandler = this.showNextDialog.bind(this);
    this.showPreviousDialogHandler = this.showPreviousDialog.bind(this);
    this.doneTalkingHandler = this.doneTalking.bind(this);
    this.dialogEventHandlers = {
      acceptQuest: this.acceptQuestHandler,
      rejectQuest: this.rejectQuestHandler,
      nextDialog: this.showNextDialogHandler,
      previousDialog: this.showPreviousDialogHandler,
      finishDialog: this.doneTalkingHandler,
    };

    // Store the dialog texts and current index
    this.dialogTexts = dialogTexts;
    this.currentDialogIndex = 0;
  }

  showPreviousDialog() {
    this.currentDialogIndex = Math.max(0, this.currentDialogIndex - 1);
    this.updateDialogText();
    this.prevButton.removeEventListener(
      "click",
      this.showPreviousDialogHandler
    );
  }

  showNextDialog() {
    this.currentDialogIndex = Math.min(
      this.dialogTexts.length - 1,
      this.currentDialogIndex + 1
    );
    this.updateDialogText();
    this.nextButton.removeEventListener("click", this.showNextDialogHandler);
  }

  updateDialogText() {
    const dialogTextElement =
      this.dialogContainer.querySelector(".npc-dialog-text");
    const dialogText = this.dialogTexts[this.currentDialogIndex];
    dialogTextElement.textContent = "";

    let currentIndex = 0;
    const typingInterval = 50; // Adjust typing speed here

    function updateEventButton(
      [acceptText, acceptEvent],
      [rejectText, rejectEvent]
    ) {
      const eventHandlerKeys = Object.keys(this.dialogEventHandlers);

      for (let i = 0; i < eventHandlerKeys.length; i++) {
        const key = eventHandlerKeys[i];
        const eventHandler = this.dialogEventHandlers[key];

        if (acceptEvent === key) {
          this.nextButton.textContent = acceptText;
          // this.nextButton.removeEventListener(
          //   "click",
          //   this.dialogEventHandlers[rejectEvent]
          // );
          this.nextButton.addEventListener("click", eventHandler);
        } else {
          this.nextButton.removeEventListener("click", eventHandler);
        }
        if (rejectEvent === key) {
          this.prevButton.textContent = rejectText;
          this.prevButton.removeEventListener("click", this.showPreviousDialog);
          this.prevButton.addEventListener("click", eventHandler);
        } else {
          this.prevButton.removeEventListener("click", eventHandler);
        }
      }
    }
    const boundUpdateEventButton = updateEventButton.bind(this);

    if (this.currentDialogIndex === this.dialogTexts.length - 1) {
      this.prevButton.style.display = "block";
      // IF ON LAST PAGE OF DIALOG
      if (this.hasQuest) {
        boundUpdateEventButton(
          ["I'll do it.", "acceptQuest"],
          ["I'll pass.", "rejectQuest"]
        );
        // this.nextButton.textContent = "I'll do it";
        // this.nextButton.removeEventListener(
        //   "click",
        //   this.showNextDialogHandler
        // );
        // this.nextButton.addEventListener("click", this.acceptQuestHandler);
        // this.prevButton.textContent = "I'll pass";
        // this.prevButton.removeEventListener(
        //   "click",
        //   this.showPreviousDialogHandler
        // );
        // this.prevButton.addEventListener("click", this.rejectQuestHandler);
      } else {
        this.nextButton.textContent = "Ok";
        this.nextButton.removeEventListener(
          "click",
          this.showNextDialogHandler
        );
        this.nextButton.addEventListener("click", this.doneTalkingHandler);
      }
    } else {
      this.prevButton.style.display = "none";
      this.nextButton.textContent = "Next";
      this.nextButton.removeEventListener("click", this.acceptQuestHandler);
      this.nextButton.removeEventListener("click", this.doneTalkingHandler);
      // this.nextButton.addEventListener("click", this.showNextDialogHandler);
      this.nextButton.removeEventListener("click", this.showNextDialogHandler);
    }

    const typingAnimation = setInterval(() => {
      if (currentIndex >= dialogText.length) {
        clearInterval(typingAnimation);
        this.isFinishedTyping = true;
      } else {
        dialogTextElement.textContent += dialogText[currentIndex];
        currentIndex++;
        this.isFinishedTyping = false;
        this.nextButton.removeEventListener(
          "click",
          this.showNextDialogHandler
        );
      }
      if (!this.isFinishedTyping) {
        this.nextButton.style.visibility = "hidden";
        // this.nextButton.textContent = "Skip";
        // this.nextButton.removeEventListener(
        //   "click",
        //   this.showNextDialogHandler
        // );
        // this.nextButton.addEventListener("click", skipTypingAnimation);
        this.skipButton.style.display = "block";
        this.skipButton.addEventListener("click", skipTypingAnimation);

        this.prevButton.style.visibility = "hidden";
      } else {
        this.skipButton.style.display = "none";
        this.nextButton.style.visibility = "visible";
        this.prevButton.style.visibility = "visible";
      }
    }, typingInterval);
    this.typingAnimation = typingAnimation;

    const skipTypingAnimation = () => {
      clearInterval(typingAnimation);
      dialogTextElement.textContent = dialogText;
      this.isFinishedTyping = true;
      this.skipButton.style.display = "none";
      this.nextButton.style.visibility = "visible";
      this.prevButton.style.visibility = "visible";
    };
  }

  acceptQuest() {
    this.isTalking = false;
    this.currentDialogIndex = 0;
    this.talkToPlayer(false, this.defaultRotation);
    this.hideDialog();
    clearInterval(this.typingAnimation);
    if (this.hasQuest) {
      this.player.questsList.push(this.questTitle);
      this.questManager.moveQuestToOngoing(
        this.questTitle,
        this.quest,
        this.npcName,
        this.questCodeTemplate,
        this.questAnswer
      );
      console.log("Quest accepted.");
    }
  }

  rejectQuest() {
    this.isTalking = false;
    this.currentDialogIndex = 0;
    this.talkToPlayer(false, this.defaultRotation);
    this.hideDialog();
    clearInterval(this.typingAnimation);
  }

  doneTalking() {
    this.isTalking = false;
    this.currentDialogIndex = 0;
    this.talkToPlayer(false, this.defaultRotation);
    this.hideDialog();
    clearInterval(this.typingAnimation);
  }

  showDialog() {
    if (!this.dialogShown) {
      this.dialogContainer.style.display = "block";
      this.isTalking = true;
      this.dialogShown = true;
      this.currentDialogIndex = 0; // Reset the current dialog index to 0
      this.updateDialogText();
    }
  }
  hideDialog() {
    if (this.dialogShown) {
      this.dialogContainer.style.display = "none";
      this.dialogShown = false;
      this.isTalking = false;
      clearInterval(this.typingAnimation);
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

    this.fbxLoader.load(
      modelPath + "Idle.fbx",
      (fbx) => {
        fbx.position.set(this.position.x, this.position.y, this.position.z);
        fbx.scale.set(scale, scale, scale);
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // if (modelTexturePath !== undefined) {
            //   if (modelTexturePath.length > 1) {
            //     const material = child.material;

            //     material.map = this.textureLoader.load(modelTexturePath[0]);
            //     material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;

            //     material.roughnessMap = this.textureLoader.load(
            //       modelTexturePath[1]
            //     );
            //     material.roughnessMap.wrapS = material.roughnessMap.wrapT =
            //       THREE.RepeatWrapping;
            //   }
            // }
            child.castShadow = true;
            child.receiveShadow = true;
            if (Array.isArray(child.material)) {
              for (let i = 0; i < materials.length; i++) {
                const material = materials[i];
                if (material instanceof THREE.MeshPhongMaterial) {
                  // Replace the material with MeshToonMaterial
                  const toonMaterial = new THREE.MeshToonMaterial({
                    color: material.color,
                    map: material.map,
                    // Copy other relevant properties as needed
                  });
                  materials[i] = toonMaterial;
                }
              }
            }
          }
        });
        // fbx.rotation.y = Math.PI / 2;
        fbx.name = npcName;
        this.scene.add(fbx);
        this.mesh = fbx;

        this.mixer = new THREE.AnimationMixer(this.mesh);
        this.initAction = this.actionClipAnimation(fbx, scale);
        this.initAction.name = "init";
        // this.actions.push(this.initAction);
        this.initAction.paused = false;
        this.initAction.play();

        this.loadAnimation(modelPath);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }
  loadAnimation(animationPath) {
    this.fbxLoader.load(animationPath + "Idle.fbx", (fbx) => {
      this.idleAction = this.actionClipAnimation(fbx, this.mixer);
      this.idleAction.name = "Idle";
      this.actions.push(this.idleAction);
    });
    this.fbxLoader.load(animationPath + "Talking.fbx", (fbx) => {
      this.talkingAction = this.actionClipAnimation(fbx, this.mixer);
      this.talkingAction.name = "Talking";
      this.actions.push(this.talkingAction);
    });
    this.fbxLoader.load(animationPath + "Walking.fbx", (fbx) => {
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

  getPosition() {
    return new THREE.Vector3(this.position.x, this.position.y, this.position.z);
  }
}
