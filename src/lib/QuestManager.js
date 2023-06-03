import toggleEditor from "../Editor";

export default class QuestManager {
  constructor() {
    this.questBox = document.getElementById("questBox");

    // Get the quest items in both sections
    this.availableQuests = document.getElementById("Available");
    this.ongoingQuests = document.getElementById("Ongoing");
  }
  toggleQuestBox() {
    this.questBox.classList.toggle("hidden");
  }

  // Function to change the quest list items
  changeQuestList(tabId, questItems) {
    const questList = document.getElementById(tabId);
    questList.innerHTML = ""; // Clear the existing items

    questItems.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      questList.appendChild(li);
    });
  }

  addQuestItem(questItem, questFrom) {
    const li = document.createElement("li");
    li.textContent = `${questFrom} - ${questItem} `;
    li.setAttribute("data-name", questItem); // Set the data-name attribute with the quest name

    this.availableQuests.appendChild(li);
  }

  // Function to move a quest from available to ongoing quests
  moveQuestToOngoing(questName) {
    const questItem = this.availableQuests.querySelector(
      `li[data-name="${questName}"]`
    );
    if (questItem) {
      this.ongoingQuests.appendChild(questItem);
      questItem.addEventListener("click", this.showQuest.bind(this));
    }
  }

  // Function to move a quest from ongoing to available quests
  moveQuestToAvailable(questName) {
    const questItem = this.ongoingQuests.querySelector(
      `li[data-name="${questName}"]`
    );
    if (questItem) {
      this.availableQuests.appendChild(questItem);
    }
  }

  showQuest() {
    toggleEditor();
  }

  startQuest() {}
}
