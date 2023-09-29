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
    this.currentNearNpc = [];
    this.position.set(position.x, position.y, position.z);

    this.dynamicLabel.setInteractLabel({
      camera: camera,
      position: this.getInteractIconPosition(),
    });
  }

  setQuestIcon(questType) {
    if (questType) {
      this.dynamicLabel.setQuestIcon({
        camera: this.camera,
        position: this.getQuestIconPosition(),
        questType,
      });

      this.finishedQuestSetting = true;
    }
  }

  update(delta) {
    if (this.finishedQuestSetting) {
      this.updateShowQuestIcon();
    }
    if (this.npcNearPlayer(this.interactRange) && this.hasDialog) {
      // this.showInteractLabel();
      if (!this.currentNearNpc.some((npc) => npc.npcName === this.npcName)) {
        this.currentNearNpc.push(this);
        this.player.nearNpcs.push(this);
      }
    } else {
      const index = this.currentNearNpc.findIndex(
        (npc) => npc.npcName === this.npcName
      );
      if (index !== -1) {
        this.currentNearNpc.splice(index, 1);
        this.player.nearNpcs.splice(index, 1);
      }
      // this.hideInteractLabel();
    }
  }

  updateShowQuestIcon() {
    // if (this.npcNearPlayer(this.questIconRange)) {
    if (this.inCameraView()) {
      this.dynamicLabel.showQuestIcon(this.getQuestIconPosition(), this.camera);
    } else {
      this.dynamicLabel.hideQuestIcon();
    }
  }

  hideInteractLabel() {
    this.dynamicLabel.hideInteractLabel();
    if (this.interactingWithPlayer()) {
      this.player.onNpcZone(null);
    }
  }

  showInteractLabel() {
    this.dynamicLabel.showInteractLabel(
      this.getInteractIconPosition(),
      this.camera
    );
    this.player.onNpcZone(this);
    if (this.interactingWithPlayer()) {
      this.dynamicLabel.hideInteractLabel();
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

  inCameraView() {
    this.camera.updateMatrix();
    this.camera.updateMatrixWorld();
    var frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        this.camera.projectionMatrix,
        this.camera.matrixWorldInverse
      )
    );
    return frustum.containsPoint(this.getPosition());
  }

  getPosition() {
    return new THREE.Vector3(this.position.x, this.position.y, this.position.z);
  }

  getPositionTracker() {
    return new THREE.Vector3(this.position.x, this.position.y, this.position.z);
  }

  getQuestIconPosition() {
    return new THREE.Vector3(
      this.position.x,
      this.position.y + 7.5,
      this.position.z
    );
  }

  getInteractIconPosition() {
    return new THREE.Vector3(
      this.position.x,
      this.position.y + 3,
      this.position.z
    );
  }
}
