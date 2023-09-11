import * as THREE from "three";
import DynamicLabel from "./DynamicLabelDisplay";

export default class Interactibles extends THREE.Object3D {
  constructor() {
    super();
  }
  initialize(position, camera, player) {
    this.dynamicLabel = new DynamicLabel();
    this.interactRange = 5;
    this.questIconRange = 30;
    this.player = player;
    this.isInteracting = false;
    this.hasDialog = false;
    this.hasQuest = false;
    this.hasStoryQuest = false;
    this.hasSideQuest = false;
    this.questIconIsSet = false;
    this.finishedQuestSetting = false;
    this.camera = camera;
    this.position.set(position.x, position.y, position.z);

    this.dynamicLabel.setInteractLabel({
      camera: camera,
      position: position,
      yOffset: 120,
    });
  }

  setQuestIcon() {
    if (this.questIconIsSet && (this.hasStoryQuest || this.hasSideQuest)) {
      const storyQuest = this.hasStoryQuest;
      this.dynamicLabel.setQuestIcon({
        camera: this.camera,
        position: this.position,
        yOffset: 200,
        storyQuest,
      });

      this.questIconIsSet = false;
      this.finishedQuestSetting = true;
    }
  }

  update(delta) {
    if (this.hasQuest) {
      this.setQuestIcon();
      if (this.finishedQuestSetting) {
        if (this.npcNearPlayer(this.questIconRange)) {
          this.dynamicLabel.showQuestIcon(this.position, this.camera);
        } else {
          this.dynamicLabel.hideQuestIcon();
        }
      }
    }

    if (this.npcNearPlayer(this.interactRange)) {
      this.isInteractable();
    } else {
      this.dynamicLabel.hideInteractLabel();
      if (this.interactingWithPlayer()) {
        this.player.onNpcZone(null);
      }
    }
  }

  isInteractable() {
    if (this.hasDialog) {
      this.dynamicLabel.showInteractLabel(this.position, this.camera);
      this.player.onNpcZone(this);
      if (this.interactingWithPlayer()) {
        this.dynamicLabel.hideInteractLabel();
      }
    }
  }

  interactingWithPlayer() {
    return this.npcName === this.player.interactingWithNpc;
  }

  npcNearPlayer(range) {
    return (
      Math.abs(this.player.getPosition().distanceTo(this.getPosition())) <=
      range
    );
  }

  getPosition() {
    return new THREE.Vector3(this.position.x, this.position.y, this.position.z);
  }

  getPositionTracker() {
    return new THREE.Vector3(this.position.x, this.position.y, this.position.z);
  }
}
