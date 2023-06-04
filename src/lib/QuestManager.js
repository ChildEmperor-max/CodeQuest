import toggleEditor from "../Editor";

export default class QuestManager {
  constructor() {
    this.questBox = document.getElementById("questBox");
    this.shown = false;
    this.questMap = new Map();

    // Get the quest items in both sections
    this.availableQuests = document.getElementById("Available");
    this.ongoingQuests = document.getElementById("Ongoing");
  }
  toggleQuestBox() {
    if (!this.shown) {
      this.questBox.style.display = "block";
      this.shown = true;
    } else {
      this.questBox.style.display = "none";
      this.shown = false;
    }
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

  addQuestItem(questItem, questTitle, questFrom) {
    const li = document.createElement("li");
    const pi = document.createElement("span");
    li.textContent = `${questTitle}`;
    pi.textContent = `${questFrom}`;
    li.setAttribute("id", questTitle); // Set the questTitle as the id
    pi.setAttribute("data-quest-item", questItem);

    this.availableQuests.appendChild(li);
    this.availableQuests.appendChild(pi);

    this.questMap.set(questTitle, questItem); // Store the questItem in the map with questTitle as the key
  }

  moveQuestToOngoing(questTitle) {
    const questItem = this.questMap.get(questTitle); // Retrieve the questItem based on the questTitle
    if (questItem) {
      // Move the elements or perform any desired actions
      const availableQuestItems = Array.from(this.availableQuests.children);
      const questItemElement = availableQuestItems.find((element) => {
        return element.getAttribute("data-quest-item") === questItem;
      });
      const questTitleElement = this.availableQuests.querySelector(
        `li[id="${questTitle}"]`
      );
      questTitleElement.textContent += `: ${questItem}`;

      if (questItemElement) {
        const questTitleElement = this.availableQuests.querySelector(
          `li[id="${questTitle}"]`
        );

        this.ongoingQuests.appendChild(questTitleElement);
        this.ongoingQuests.appendChild(questItemElement);
        questTitleElement.addEventListener(
          "click",
          this.showQuestEditor.bind(this)
        );
      }
    }
  }

  // Function to move a quest from ongoing to available quests
  moveQuestToAvailable(questTitle) {
    const questItem = this.questMap.get(questTitle); // Retrieve the questItem based on the questTitle
    if (questItem) {
      // Move the elements or perform any desired actions
      const availableQuestItems = Array.from(this.ongoingQuests.children);
      const questItemElement = availableQuestItems.find((element) => {
        return element.getAttribute("data-quest-item") === questItem;
      });

      if (questItemElement) {
        const questTitleElement = this.ongoingQuests.querySelector(
          `li[id="${questTitle}"]`
        );

        this.availableQuests.appendChild(questTitleElement);
        this.availableQuests.appendChild(questItemElement);
        questTitleElement.addEventListener(
          "click",
          this.showQuestEditor.bind(this)
        );
      }
    }
  }

  showQuestEditor() {
    toggleEditor();
  }

  startQuest() {}
}
