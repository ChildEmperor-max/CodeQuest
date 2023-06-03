import * as THREE from "three";

// Define the state machine class
class StateMachine {
  constructor(initialState) {
    this.currentState = initialState;
    this.interactionTriggered = false;
    this.interactionComplete = false;
  }

  transitionTo(newState) {
    this.currentState = newState;
    this.currentState.enter();
  }

  update() {
    this.currentState.update();
  }
}

// Define the states as separate classes
class IdleState {
  constructor(object) {
    this.object = object;
    this.interactionTriggered = false;
  }

  enter() {
    // console.log("Entering idle state");
  }

  update() {
    // console.log("IDLE");
    if (this.interactionTriggered) {
      this.object.stateMachine.transitionTo(new InteractingState(this.object));
    }
  }
}

class InteractingState {
  constructor(object) {
    this.object = object;
    this.interactionComplete = false;
  }

  enter() {
    // console.log("Entering interacting state");
  }

  update() {
    // Example: Perform interacting logic
    // Once the interaction is complete, transition back to "idle" state
    // console.log("INTERACTING");
    if (this.interactionComplete) {
      this.object.stateMachine.transitionTo(new IdleState(this.object));
    }
  }
}

export { StateMachine, IdleState, InteractingState };

// // Define the NPC class
// class NPC {
//   constructor() {
//     var geometry = new THREE.BoxGeometry(1, 1, 1);
//     var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//     this.mesh = new THREE.Mesh(geometry, material);
//     scene.add(this.mesh);

//     this.stateMachine = new StateMachine(new IdleState(this));
//   }

//   update() {
//     this.stateMachine.update();
//   }
// }

// // Example usage in your Three.js scene
// var npc1 = new NPC();
// var npc2 = new NPC();

// function animate() {
//   requestAnimationFrame(animate);

//   npc1.update();
//   npc2.update();

//   renderer.render(scene, camera);
// }
