import * as THREE from "three";

export default class TextManager {
  constructor(scene) {
    this.scene = scene;
  }
  initialize({ text, position, yOffset, camera }) {
    this.text = text;
    this.camera = camera;
    this.position = new THREE.Vector3(0, 0, 0);
    this.yOffset = 70;
    this.xOffset = 20;
    this.showFlag = false;
    this.actionHint = document.getElementById("action-hint");
    this.actionHint.style.display = "none";
    this.addText(text);
  }

  updatePosition(pos) {
    var coords = this.toXYCoords(pos);
    this.actionHint.style.top = coords.y + "px";
    this.actionHint.style.left = coords.x + "px";
  }

  setPosition(pos) {
    this.position = pos;
  }

  addText(text) {
    this.actionHint.innerHTML = text;

    var coords = this.toXYCoords(this.position);
    this.actionHint.style.top = coords.y + "px";
    this.actionHint.style.left = coords.x + "px";
    this.hideText();
    document.body.appendChild(this.actionHint);
  }
  showText(pos) {
    this.showFlag = true;
    this.actionHint.style.display = "block";
    this.updatePosition(pos);
  }

  hideText() {
    this.showFlag = false;
    this.actionHint.style.display = "none";
  }

  toXYCoords(pos) {
    var vector = pos.clone();
    vector.project(this.camera);
    vector.x = ((vector.x + 1) / 2) * window.innerWidth - this.xOffset;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight - this.yOffset;
    return vector;
  }
}
