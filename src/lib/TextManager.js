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

  //   createCSS3DObject(content) {
  //     // convert the string to dome elements
  //     var wrapper = document.createElement("div");
  //     wrapper.innerHTML = content;
  //     var div = wrapper.firstChild;

  //     // set some values on the div to style it.
  //     // normally you do this directly in HTML and
  //     // CSS files.
  //     div.style.width = "70px";
  //     div.style.height = "70px";
  //     div.style.opacity = 0.3;
  //     div.style.background = new THREE.Color(Math.random() * 0xffffff).getStyle();

  //     // Change the font style
  //     div.style.fontFamily = "Arial";
  //     // div.style.fontSize = "24px";
  //     div.style.color = "black";

  //     // create a CSS3Dobject and return it.
  //     var object = new CSS3DObject(div);
  //     return object;
  //   }
}
