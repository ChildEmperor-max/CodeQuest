export default class DynamicLabel {
  constructor() {
    this.interactLabel = document.getElementById("action-hint");
    this.npcNameLabel = document.createElement("div");
    this.npcNameLabel.setAttribute("class", "npc-name-display");
    this.labelShownFlag;
    this.xOffset = 0;
    this.yOffset = 150;
  }

  setNpcNameLabel({ text, camera, position, yOffset }) {
    this.npcNameLabel.innerHTML = text;
    this.yOffset = yOffset;

    var coords = this.toXYCoords(position, camera);
    this.npcNameLabel.style.top = coords.y + "px";
    this.npcNameLabel.style.left = coords.x + "px";

    document.body.appendChild(this.npcNameLabel);
    //   hideInteractLabel();
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

  toXYCoords(position, camera) {
    var vector = position.clone();
    vector.project(camera);
    vector.x = ((vector.x + 1) / 2) * window.innerWidth - this.xOffset;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight - this.yOffset;
    return vector;
  }
}
