import toggleEditor from "../Editor";
import Quests from "../db/quests";

export default class QuestManager {
  constructor() {
    this.quests = new Quests();
    this.questBox = document.getElementById("questBox");
    this.shown = false;
    this.questMap = new Map();

    // Get the quest items in both sections
    this.availableQuests = document.getElementById("Available");
    this.ongoingQuests = document.getElementById("Ongoing");

    this.questButton = document.getElementById("quest-button");
    this.questButton.addEventListener("click", this.toggleQuestBox.bind(this));

    this.questButton = document.getElementById("close-quest-button");
    this.questButton.addEventListener("click", this.toggleQuestBox.bind(this));

    this.startQuestButton = document.createElement("button");
    this.startQuestButton.textContent = "Start";
    this.startQuestButton.style.display = "none";
    this.startQuestButton.setAttribute("class", "quest-list-button");
    this.removeQuestButton = document.createElement("button");
    this.removeQuestButton.textContent = "Cancel";
    this.removeQuestButton.style.display = "none";
    this.removeQuestButton.setAttribute("class", "quest-list-button");

    this.popupContainer = document.getElementById("popupContainer");
    this.closePopupButton = document.getElementById("closeButton");

    this.closePopupButton.addEventListener("click", () => {
      this.popupContainer.style.display = "none";
    });
  }
  toggleQuestBox() {
    this.questBox.classList.toggle("hidden");
    if (this.questBox.classList.contains("hidden")) {
      this.questBox.style.display = "none";
    } else {
      this.questBox.style.display = "block";
      this.popupContainer.classList.add("fadeOut");
      setTimeout(() => {
        this.popupContainer.style.display = "none";
        this.popupContainer.classList.remove("fadeOut");
      }, 800);
    }
  }

  changeQuestList(tabId, questItems) {
    const questList = document.getElementById(tabId);
    questList.innerHTML = "";

    questItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      questList.appendChild(li);
    });
  }

  addQuestItem(questItem, questTitle, questFrom) {
    const li = document.createElement("li");
    const pi = document.createElement("span");
    li.textContent = `${questTitle}`;
    pi.textContent = `${questFrom}`;
    li.setAttribute("id", questTitle); // Set the questTitle as the id
    pi.setAttribute("data-quest-item", questItem);

    this.quests.createQuest(
      questTitle,
      questItem,
      this.quests.status.inactive,
      questFrom
    );

    this.availableQuests.appendChild(li);
    this.availableQuests.appendChild(pi);

    this.questMap.set(questTitle, questItem);

    this.removeQuestButton.addEventListener("click", () => {
      this.moveQuestToAvailable(questTitle);
    });
    this.startQuestButton.addEventListener("click", toggleEditor.bind(this));
  }

  moveQuestToOngoing(questTitle) {
    this.popupContainer.style.display = "block";
    document.getElementById("quest-item").textContent = questTitle;
    const questItem = this.questMap.get(questTitle);
    this.quests.updateQuestStatus(questTitle, this.quests.status.active);
    if (questItem) {
      const availableQuestItems = Array.from(this.availableQuests.children);
      const questItemElement = availableQuestItems.find((element) => {
        return element.getAttribute("data-quest-item") === questItem;
      });
      const questTitleElement = this.availableQuests.querySelector(
        `li[id="${questTitle}"]`
      );
      questTitleElement.textContent = `${questTitle}: ${questItem}`;

      if (questItemElement) {
        const questTitleElement = this.availableQuests.querySelector(
          `li[id="${questTitle}"]`
        );
        var br = document.createElement("br");
        questTitleElement.appendChild(br);
        questTitleElement.appendChild(this.startQuestButton);
        questTitleElement.appendChild(this.removeQuestButton);

        this.ongoingQuests.appendChild(questTitleElement);
        this.ongoingQuests.appendChild(questItemElement);
        // this.startQuestButton.style.display = "block";
        // this.removeQuestButton.style.display = "block";
      }
    }
  }

  moveQuestToAvailable(questTitle) {
    toggleEditor(false);
    const questItem = this.questMap.get(questTitle);
    this.quests.updateQuestStatus(questTitle, this.quests.status.inactive);
    if (questItem) {
      const availableQuestItems = Array.from(this.ongoingQuests.children);
      const questItemElement = availableQuestItems.find((element) => {
        return element.getAttribute("data-quest-item") === questItem;
      });
      const questTitleElement = this.ongoingQuests.querySelector(
        `li[id="${questTitle}"]`
      );
      questTitleElement.textContent = `${questTitle}`;

      if (questItemElement) {
        this.availableQuests.appendChild(questTitleElement);
        this.availableQuests.appendChild(questItemElement);
        // this.startQuestButton.style.display = "none";
        // this.removeQuestButton.style.display = "none";
      }
    }
  }
}
