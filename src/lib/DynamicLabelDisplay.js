export default class DynamicLabel {
  constructor() {
    this.labelShownFlag;
    this.nameXOffset = 0;
    this.namenameYOffset = 0;
    this.interactXOffset = 0;
    this.interactYOffset = 0;
    this.questIconYOffset = 0;
  }

  // NAME LABEL
  setNpcNameLabel({ text, camera, position, yOffset }) {
    this.npcNameLabel = document.createElement("div");
    this.npcNameLabel.setAttribute("class", "npc-name-display");
    this.npcNameLabel.innerHTML = text;
    this.nameYOffset = yOffset;

    var coords = this.toXYCoords(position, camera, yOffset);
    this.npcNameLabel.style.top = coords.y + "px";
    this.npcNameLabel.style.left = coords.x + "px";

    document.body.appendChild(this.npcNameLabel);
    //   hideNpcNameLabel();
  }

  updateNpcNameLabel(position, camera, yOffset) {
    var coords = this.toXYCoords(position, camera, yOffset);
    this.npcNameLabel.style.top = coords.y + "px";
    this.npcNameLabel.style.left = coords.x + "px";
  }

  showNpcNameLabel(position, camera) {
    this.labelShownFlag = true;
    this.npcNameLabel.style.display = "block";
    this.updateNpcNameLabel(position, camera, this.nameYOffset);
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

    var coords = this.toXYCoords(position, camera, yOffset);
    this.interactLabel.style.top = coords.y + "px";
    this.interactLabel.style.left = coords.x + "px";

    this.hideInteractLabel();
    document.body.appendChild(this.interactLabel);
  }

  updateInteractLabel(position, camera, yOffset) {
    var coords = this.toXYCoords(position, camera, yOffset);
    this.interactLabel.style.top = coords.y + "px";
    this.interactLabel.style.left = coords.x + "px";
  }

  showInteractLabel(position, camera) {
    this.interactLabel.style.display = "flex";
    this.updateInteractLabel(position, camera, this.interactYOffset);
  }

  hideInteractLabel() {
    this.interactLabel.style.display = "none";
  }

  // QUESTS ICON
  setQuestIcon({ camera, position, yOffset, storyQuest }) {
    this.questIcon = document.createElement("div");
    this.questIcon.setAttribute(
      "id",
      storyQuest ? "story-quest-icon" : "side-quest-icon"
    );
    this.questIcon.innerHTML = "!";
    this.questIconYOffset = yOffset;

    var coords = this.toXYCoords(position, camera, yOffset);
    this.questIcon.style.top = coords.y + "px";
    this.questIcon.style.left = coords.x + "px";

    document.body.appendChild(this.questIcon);
    this.hideQuestIcon();
  }

  updateQuestIcon(position, camera, yOffset) {
    var coords = this.toXYCoords(position, camera, yOffset);
    this.questIcon.style.top = coords.y + "px";
    this.questIcon.style.left = coords.x + "px";
  }

  showQuestIcon(position, camera) {
    this.questIcon.style.display = "flex";
    this.updateQuestIcon(position, camera, this.questIconYOffset);
  }

  hideQuestIcon() {
    this.questIcon.style.display = "none";
  }

  toXYCoords(position, camera, yOffset) {
    var vector = position.clone();
    vector.project(camera);
    vector.x = ((vector.x + 1) / 2) * window.innerWidth;
    vector.y = (-(vector.y - 1) / 2) * window.innerHeight - yOffset;
    return vector;
  }
}
