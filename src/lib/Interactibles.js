import * as THREE from "three";
import DynamicLabel from "./DynamicLabelDisplay";

export default class Interactibles extends THREE.Object3D {
  constructor() {
    super();
  }
  initialize(position, camera, player) {
    this.dynamicLabel = new DynamicLabel();
    this.nameDisplayYposition = 95;
    this.interactLabelYPosition = 5;
    this.interactRange = 5;
    this.player = player;
    this.isInteracting = false;

    this.dynamicLabel.setInteractLabel({
      camera: camera,
      position: position,
      yOffset: this.interactLabelYPosition,
    });
  }

  update(delta) {
    if (this.npcNearPlayer()) {
      this.dynamicLabel.showInteractLabel(this.position, this.camera);
      this.player.onNpcZone(this);
      if (this.player.interactingWithNpc === this.npcName) {
        this.dynamicLabel.hideInteractLabel();
      }
    } else {
      this.dynamicLabel.hideInteractLabel();
      if (this.npcName === this.player.interactingWithNpc) {
        this.player.onNpcZone(null);
      }
    }
    this.dynamicLabel.updateInteractLabel(this.position, this.camera);
  }

  npcNearPlayer() {
    return (
      Math.abs(this.player.getPosition().distanceTo(this.getPosition())) <=
      this.interactRange
    );
  }

  getPosition() {
    return new THREE.Vector3(this.position.x, this.position.y, this.position.z);
  }
}
