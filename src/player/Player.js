import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as TWEEN from "@tweenjs/tween.js";
import QuestManager from "../lib/QuestManager";
import keys from "../lib/KeyControls";
import TextManager from "../lib/TextManager";

export default class Player extends THREE.Object3D {
  constructor() {
    super();
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
    this.obstacles = [];
    this.actions = [];
    this.questsList = [];
    this.running = false;
    this.groundMesh = undefined;
    this.collisionBox = undefined;
    this.questManager = new QuestManager();
  }

  initialize(scene, camera, position, obstacles, groundMesh) {
    this.scene = scene;
    this.walkingSpeed = 10;
    this.movementSpeed = this.walkingSpeed;
    this.runningSpeed = 20;
    this.modelScale = 0.01;
    this.loadModel(scene);
    this.position.set(position.x, position.y, position.z);
    this.obstacles = obstacles;
    this.height = 5;
    this.camera = camera;
    this.add(camera);
    this.groundMesh = groundMesh;
    // this.obstacles.push(groundMesh);
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
    // this.textManager = new TextManager(this.scene);
    // this.textManager.initialize({
    //   text: "<div><h3>E</h3><div>",
    //   position: position,
    //   yOffset: 4,
    //   camera: this.camera,
    // });
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
      this.movement(delta);
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
    this.updateQuestVisibility();
  }
  updateQuestVisibility() {
    if (keys.q.justPressed) {
      // console.log("quests: ", this.questsList);
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

  updateNpcDetection(npcs) {
    var npcDetectionShape = new THREE.Sphere(this.position, 5);
    for (var i = 0; i < npcs.length; i++) {
      var npc = npcs[i];
      var npcPosition = new THREE.Vector3();
      npc.getWorldPosition(npcPosition);

      var collided = npcDetectionShape.containsPoint(npcPosition);

      if (collided) {
        // this.textManager.updatePosition(npcPosition);
        if (!npc.isTalking) {
          // this.textManager.showText(npcPosition);
        }
        if (keys.e.pressed) {
          // this.textManager.hideText();
          npc.talkToPlayer(true, this.position);
          this.rotateTowards(npc.position);
          this.enableNpcDetection = false;
        }
      } else {
        // if (this.textManager) {
        if (!this.enableNpcDetection) {
          this.enableNpcDetection = true;
        }
        // this.textManager.hideText();
        npc.talkToPlayer(false, npc.defaultRotation);
        // }
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

  collision() {
    var position = this.getPosition();
    var obstacles = this.obstacles;
    var raycaster = this.caster;
    var collision = {
      x: false,
      z: false,
    };
    var collisionDirection = {
      x: 0,
      z: 0,
    };

    for (var i = 0; i < 8; i++) {
      raycaster.set(
        new THREE.Vector3(position.x, position.y + 3, position.z),
        this.collisionRays[i]
      );
      var intersections = raycaster.intersectObjects(obstacles);
      if (intersections.length > 0 && intersections[0].distance <= 2) {
        collision.x = true;
        collisionDirection = this.collisionRays[i];
        break;
      }
    }

    return [collision, collisionDirection];
  }
  motion(delta) {
    if (this.direction.x !== 0 || this.direction.z !== 0) {
      const movement = this.direction
        .clone()
        .multiplyScalar(this.movementSpeed * delta);
      this.mesh.position.add(movement);
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
    const xzOffset = 0.01;
    const raycastGround = new THREE.Raycaster(
      new THREE.Vector3(from_vec3.x, from_vec3.y + 2, from_vec3.z),
      new THREE.Vector3(0, -this.rayLength, 0)
    );

    // this.raycastCollidables = new THREE.Raycaster(
    //   new THREE.Vector3(from_vec3.x, from_vec3.y + 2, from_vec3.z),
    //   this.raycastCollideDirection
    // );
    const near = 0.1;
    const far = 5.0;

    const front = new THREE.Raycaster(
      new THREE.Vector3(from_vec3.x, from_vec3.y + 2, from_vec3.z),
      new THREE.Vector3(0, -this.rayLength, -xzOffset)
    );
    front.near = near;
    front.far = far;
    const back = new THREE.Raycaster(
      new THREE.Vector3(from_vec3.x, from_vec3.y + 2, from_vec3.z),
      new THREE.Vector3(0, -this.rayLength, xzOffset)
    );
    back.near = near;
    back.far = far;
    const left = new THREE.Raycaster(
      new THREE.Vector3(from_vec3.x, from_vec3.y + 2, from_vec3.z),
      new THREE.Vector3(-xzOffset, -this.rayLength, 0)
    );
    left.near = near;
    left.far = far;
    const right = new THREE.Raycaster(
      new THREE.Vector3(from_vec3.x, from_vec3.y + 2, from_vec3.z),
      new THREE.Vector3(xzOffset, -this.rayLength, 0)
    );
    right.near = near;
    right.far = far;

    this.raycasters = [front, back, left, right];

    let intersectionHeight = null;
    const intersectsGround = raycastGround.intersectObject(object_to_intersect);
    if (intersectsGround.length > 0) {
      const intersectedObject = intersectsGround[0].object;
      intersectionHeight = intersectsGround[0].point.y;
    }

    this.obstacles.forEach((collisionObject) => {
      this.raycasters.forEach((raycast) => {
        const intersectingCollidables =
          raycast.intersectObject(collisionObject);
        if (intersectingCollidables.length > 0) {
          // intersectionHeight = intersectingCollidables.point.y;
          const boundingBox = new THREE.Box3().setFromObject(collisionObject);
          var deltaX = this.playerbox.max.x - boundingBox.min.x;
          var deltaZ = this.playerbox.max.z - boundingBox.min.z;
          var deltaBackZ = this.playerbox.min.z - boundingBox.max.z;
          if (deltaX < deltaZ) {
            if (this.direction.x > 0) {
              // when going right
              this.direction.x = 0;
            }
          } else if (-deltaX < deltaZ) {
            if (this.direction.x < 0) {
              // when going left
              this.direction.x = 0;
            }
          }
          if (deltaBackZ > -deltaZ) {
            if (this.direction.z < 0) {
              // when going front
              this.direction.z = 0;
            }
          } else if (-deltaBackZ > deltaZ) {
            // when going back
            if (this.direction.z > 0) {
              this.direction.z = 0;
            }
          }
        }
      });
    });

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
    const lerpFactor = 0.1; // Adjust the lerp factor to control the speed of interpolation

    if (groundHeight !== null) {
      const maxHeight = groundHeight + this.height / 2;
      if (this.mesh.position.y <= maxHeight) {
        this.mesh.position.y = groundHeight;
        // this.position.lerp(targetPosition, lerpFactor);
        this.position.y = this.mesh.position.y;
        this.direction.y = Math.max(0, this.direction.y);
        this.isGrounded = true;
      } else {
        // fall
        this.mesh.position.y -= 9.81 * deltaTime;
        // this.position.lerp(this.mesh.position, lerpFactor);
        this.position.y = this.mesh.position.y;
        this.direction.y -= 9.81 * deltaTime;
        this.isGrounded = false;
      }
    } else {
      // if there is no ground
      this.mesh.position.y -= 9.81 * deltaTime;
      this.position.y = this.mesh.position.y;
      this.direction.y -= 9.81 * deltaTime;
      this.isGrounded = false;
    }

    this.position.add(this.direction.clone().multiplyScalar(deltaTime));
  }

  getPosition() {
    return new THREE.Vector3(this.position.x, this.position.y, this.position.z);
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
      this.running = true;
      this.movementSpeed = this.runningSpeed;
    } else {
      this.running = false;
      this.movementSpeed = this.walkingSpeed;
    }
    // if (keys.shift.pressed) {
    //     this.running = true;
    //     this.movementSpeed = this.runningSpeed;
    // } else {
    //   this.running = false;
    //   this.movementSpeed = this.walkingSpeed;
    // }
    this.playerbox = new THREE.Box3().setFromObject(this.collisionBox);
    if (this.playerbox) {
      for (let i = 0; i < this.npcs.length; i++) {
        if (this.npcs[i].npcbox) {
          if (this.playerbox.intersectsBox(this.npcs[i].npcbox)) {
            var deltaX = this.playerbox.max.x - this.npcs[i].npcbox.min.x;
            var deltaZ = this.playerbox.max.z - this.npcs[i].npcbox.min.z;
            var deltaBackZ = this.playerbox.min.z - this.npcs[i].npcbox.max.z;
            if (deltaX < deltaZ) {
              if (this.direction.x > 0) {
                // when going right
                this.direction.x = 0;
              }
            } else if (-deltaX < deltaZ) {
              if (this.direction.x < 0) {
                // when going left
                this.direction.x = 0;
              }
            }
            if (deltaBackZ > -deltaZ) {
              if (this.direction.z < 0) {
                // when going front
                this.direction.z = 0;
              }
            } else if (-deltaBackZ > deltaZ) {
              // when going back
              if (this.direction.z > 0) {
                this.direction.z = 0;
              }
            }
          }
        }
      }
    }

    this.updatePositionToGround(delta);
    this.direction.normalize(); // Normalize the direction vector to ensure consistent speed
  }

  loadModel(scene) {
    // this.modelScale = 0.01;
    const loadingManager = new THREE.LoadingManager();
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
    var loadingGameScreenDiv = document.getElementById("loading-game-screen");
    loadingManager.onStart = () => {
      loadingGameScreenDiv.style.display = "block";
    };
    // Register a callback for the onProgress event
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = itemsLoaded / itemsTotal;
      // Update the loading progress (e.g., update a progress bar)
      // loadingGameScreenDiv.innerHTML = `Loading progress: ${progress}`;
      console.log(`Loading progress: ${progress}`);
    };

    // Register a callback for the onLoad event
    loadingManager.onLoad = () => {
      // All assets have been loaded, hide the loading screen
      loadingGameScreenDiv.style.display = "none";
    };
    this.fbxLoader = new FBXLoader(loadingManager);

    const playerModelPath = "/src/assets/models/animations/";
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
          }
        });
        // fbx.rotation.y = Math.PI / 2;
        fbx.name = "Player";
        scene.add(fbx);
        this.mesh = fbx;
        // this.raycasterDebug(this.mesh.position);

        this.mixer = new THREE.AnimationMixer(this.mesh);
        // this.mixer.timeScale = 7.0;

        this.loadAnimation(this.mixer, playerModelPath);
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
  }

  actionClipAnimation(fbx, mixer) {
    fbx.scale.set(this.modelScale, this.modelScale, this.modelScale);
    const animationClip = fbx.animations[0];
    const animationAction = mixer.clipAction(animationClip);
    return animationAction;
  }
}
