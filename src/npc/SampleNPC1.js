import * as THREE from "three";
import NPCLoader from "./NPCLoader";

export default class SampleNPC1 extends NPCLoader {
  constructor(scene) {
    super(scene);
    this.path = "/src/assets/models/animations/";
  }
  initialize(
    position = new THREE.Vector3(0, 0, 0),
    camera,
    player,
    canvas,
    rotation = Math.PI / 2,
    modelPath = this.path,
    npcName = "SampleNPC1",
    scale = 0.01
  ) {
    super.initialize(
      position,
      camera,
      player,
      canvas,
      rotation,
      modelPath,
      npcName,
      scale
    );
    this.createDialogBox(
      [
        "Hello kid! I have a programming problem for you to solve.",
        "What I want you to do is what every programmers did to start their path.",
        'Using this line of code "System.out.println()", how would you output the word "Hello World"? ',
      ],
      "Hello World!",
      true
    );
  }
  // setDialog(dialogTexts) {
  //   super.setDialog(dialogTexts);
  // }
}

// function loadAnimation(mixer) {
//   this.fbxLoader.load("/src/assets/player/Idle.fbx", (idleFbx) => {
//     this.idleAction = this.actionClipAnimation(idleFbx, mixer);
//     this.idleAction.name = "idle";
//     this.actions.push(this.idleAction);
//   });

//   this.fbxLoader.load("/src/assets/player/Walking.fbx", (walkingFbx) => {
//     this.walkingAction = this.actionClipAnimation(walkingFbx, mixer);
//     this.walkingAction.name = "walking";
//     this.actions.push(this.walkingAction);
//   });

//   this.fbxLoader.load("/src/assets/player/Running.fbx", (runningFbx) => {
//     this.runningAction = this.actionClipAnimation(runningFbx, mixer);
//     this.runningAction.name = "running";
//     this.actions.push(this.runningAction);
//   });
// }

// function actionClipAnimation(fbx, mixer) {
//   fbx.scale.set(0.01, 0.01, 0.01);
//   const animationClip = fbx.animations[0];
//   const animationAction = mixer.clipAction(animationClip);
//   return animationAction;
// }
