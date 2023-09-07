export default class DynamicLabel {
  constructor() {
    this.labelShownFlag;
    this.nameXOffset = 0;
    this.namenameYOffset = 150;
    this.interactXOffset = 0;
  }

  // NAME LABEL
  setNpcNameLabel({ text, camera, position, yOffset }) {
    this.npcNameLabel = document.createElement("div");
    this.npcNameLabel.setAttribute("class", "npc-name-display");
    this.npcNameLabel.innerHTML = text;
    this.nameYOffset = yOffset;

    var coords = this.toXYCoords(position, camera);
    this.npcNameLabel.style.top = coords.y + "px";
    this.npcNameLabel.style.left = coords.x + "px";

    document.body.appendChild(this.npcNameLabel);
    //   hideNpcNameLabel();
  }

  updateNpcNameLabel(position, camera) {
    var coords = this.toXYCoords(position, camera);
    this.npcNameLabel.style.top = coords.y + "px";
    this.npcNameLabel.style.left = coords.x + "px";
  }

  showNpcNameLabel(position, camera) {
    this.labelShownFlag = true;
    this.npcNameLabel.style.display = "block";
    this.updateNpcNameLabel(position, camera);
  }

  hideNpcNameLabel() {
    this.labelShownFlag = false;
    this.npcNameLabel.style.display = "none";
  }

  // INTERACT LABEL
  setInteractLabel({ camera, position, yOffset }) {
    this.interactLabel = document.createElement("div");
    this.interactLabel.setAttribute("id", "interact-text");
    this.interactLabel.innerHTML = "E";
    this.interactYOffset = yOffset;

    var coords = this.toXYCoords(position, camera);
    this.interactLabel.style.top = coords.y + "px";
    this.interactLabel.style.left = coords.x + "px";

    this.hideInteractLabel();
    document.body.appendChild(this.interactLabel);
  }

  updateInteractLabel(position, camera) {
    var coords = this.toXYCoords(position, camera);
    this.interactLabel.style.top = coords.y + "px";
    this.interactLabel.style.left = coords.x + "px";
  }

  showInteractLabel(position, camera) {
    this.interactLabel.style.display = "flex";
    this.updateInteractLabel(position, camera);
  }

  hideInteractLabel() {
    this.interactLabel.style.display = "none";
  }

  toXYCoords(position, camera) {
    var vector = position.clone();
    vector.project(camera);
    vector.x = ((vector.x + 1) / 2) * window.innerWidth - this.nameXOffset;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight - this.nameYOffset;
    return vector;
  }
}
