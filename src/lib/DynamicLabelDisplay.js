export default class DynamicLabel {
  constructor() {
    this.labelShownFlag;
  }

  // NAME LABEL
  setNpcNameLabel({ text, camera, position }) {
    this.npcNameLabel = document.createElement("div");
    this.npcNameLabel.setAttribute("class", "npc-name-display");
    this.npcNameLabel.innerHTML = text;

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
    this.updateNpcNameLabel(position, camera, this.name);
  }

  hideNpcNameLabel() {
    this.labelShownFlag = false;
    this.npcNameLabel.style.display = "none";
  }

  // INTERACT LABEL
  setInteractLabel({ camera, position }) {
    this.interactLabel = document.createElement("div");
    this.interactLabel.setAttribute("id", "interact-text");
    this.interactLabel.innerHTML = "E";

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
    // this.updateInteractLabel(position, camera, this.interactLabel);
  }

  hideInteractLabel() {
    this.interactLabel.style.display = "none";
  }

  // QUESTS ICON
  setQuestIcon({ camera, position, questType, questStatus }) {
    this.questIcon = document.createElement("div");
    this.questIcon.setAttribute("class", "quest-icon");
    this.questIcon.setAttribute("id", questType + "-quest-icon");
    this.questIcon.innerHTML = `${
      questStatus === "toComplete" ? "!" : questStatus === "inactive" ? "?" : ""
    }`;

    var coords = this.toXYCoords(position, camera);
    this.questIcon.style.top = coords.y + "px";
    this.questIcon.style.left = coords.x + "px";

    document.body.appendChild(this.questIcon);
    this.hideQuestIcon();
  }

  updateQuestIcon(position, camera) {
    var coords = this.toXYCoords(position, camera);
    this.questIcon.style.top = coords.y + "px";
    this.questIcon.style.left = coords.x + "px";
  }

  showQuestIcon(position, camera, questStatus) {
    this.questIcon.style.display = "flex";
    this.questIcon.innerHTML = `${
      questStatus === "toComplete" ? "!" : questStatus === "inactive" ? "?" : ""
    }`;
    this.updateQuestIcon(position, camera, this.questIcon);
  }

  hideQuestIcon() {
    this.questIcon.style.display = "none";
  }

  // DISTANCE LABEL
  setDistanceLabel({ camera, position }) {
    this.distanceLabel = document.createElement("div");
    this.distanceLabel.setAttribute("id", "distance-label");
    this.distanceLabel.innerHTML = "123";

    var coords = this.toXYCoords(position, camera);
    this.distanceLabel.style.top = coords.y + "px";
    this.distanceLabel.style.left = coords.x + "px";

    this.hideDistanceLabel();
    document.body.appendChild(this.distanceLabel);
  }

  updateDistanceLabel(position, camera, distance) {
    var coords = this.toXYCoords(position, camera);
    this.distanceLabel.innerHTML = distance + "m";
    this.distanceLabel.style.top = coords.y + "px";
    this.distanceLabel.style.left = coords.x + "px";
  }

  showDistanceLabel(position, camera, distance) {
    this.distanceLabel.style.display = "flex";
    this.updateDistanceLabel(position, camera, distance);
  }

  hideDistanceLabel() {
    this.distanceLabel.style.display = "none";
  }

  toXYCoords(position, camera) {
    var vector = position.clone();
    vector.project(camera);
    vector.x = ((vector.x + 1) / 2) * window.innerWidth;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight;
    return vector;
  }
}
