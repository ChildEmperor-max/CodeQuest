import toggleEditor from "../Editor";
import Quests from "../db/quests";
import { fetchNpcQuestDialog, fetchQuestTable } from "../db/HandleTable";

export default class QuestManager {
  constructor() {
    this.quests = new Quests();
    this.questBox = document.getElementById("questBox");
    this.shown = false;
    this.ncpQuestMap = new Map();

    // Get the quest items in both sections
    this.availableQuests = document.getElementById("Available");
    this.ongoingQuests = document.getElementById("Ongoing");

    this.questButton = document.getElementById("quest-button");
    this.questButton.addEventListener("click", this.toggleQuestBox.bind(this));

    this.questButton = document.getElementById("close-quest-button");
    this.questButton.addEventListener("click", this.toggleQuestBox.bind(this));

    this.popupContainer = document.getElementById("popupContainer");
    this.closePopupButton = document.getElementById("closeButton");

    this.startQuestButton = document.createElement("button");
    this.startQuestButton.textContent = "Start";
    this.startQuestButton.style.display = "none";
    this.startQuestButton.setAttribute("class", "quest-list-button");
    this.removeQuestButton = document.createElement("button");
    this.removeQuestButton.textContent = "Cancel";
    this.removeQuestButton.style.display = "none";
    this.removeQuestButton.setAttribute("class", "quest-list-button");

    this.closePopupButton.addEventListener("click", () => {
      this.popupContainer.style.display = "none";
    });
  }
  toggleQuestBox() {
    // var questData = this.quests.fetchQuest();
    const viewQuestData = async () => {
      try {
        const npcData = await fetchNpcQuestDialog();
        // npcData.forEach((element) => {
        //   console.log(element.quest_status);
        // });
      } catch (error) {
        console.error("[ERROR]:", error);
      }
    };
    viewQuestData();

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

  initialize() {
    const addNpcQuestData = async () => {
      try {
        const npcData = await fetchNpcQuestDialog();
        npcData.forEach((element) => {
          this.addQuestItem(
            element.quest_description,
            element.quest_title,
            element.npc_name,
            element.quest_type,
            element.quest_status
          );
        });
      } catch (error) {
        console.error("[ERROR]:", error);
      }
    };

    addNpcQuestData();
  }

  addQuestItem(questDesc, questTitle, questFrom, questType, questStatus) {
    questTitle = questTitle.trim();
    questStatus = questStatus.trim();
    questDesc = questDesc.trim();
    questFrom = questFrom.trim();
    const li = document.createElement("li");
    const pi = document.createElement("span");
    li.textContent = `${questTitle}`;
    pi.textContent = `${questFrom}`;
    li.setAttribute("id", questTitle); // Set the questTitle as the id
    pi.setAttribute("data-quest-item", questFrom);

    this.quests.createQuest(
      questTitle,
      questDesc,
      this.quests.status.inactive,
      questFrom,
      questType
    );
    this.startQuestButton = document.createElement("button");
    this.startQuestButton.textContent = "Start";
    this.startQuestButton.style.display = "none";
    this.startQuestButton.setAttribute("class", "quest-list-button");
    this.removeQuestButton = document.createElement("button");
    this.removeQuestButton.textContent = "Cancel";
    this.removeQuestButton.style.display = "none";
    this.removeQuestButton.setAttribute("class", "quest-list-button");
    if (questStatus === this.quests.status.active) {
      this.ongoingQuests.appendChild(li);
      this.ongoingQuests.appendChild(pi);
      li.textContent = `${questTitle}: ${questDesc}`;
      var br = document.createElement("br");
      li.appendChild(br);
      li.appendChild(this.startQuestButton);
      li.appendChild(this.removeQuestButton);
    } else if (questStatus === this.quests.status.inactive) {
      this.availableQuests.appendChild(li);
      this.availableQuests.appendChild(pi);
      // li.appendChild(this.startQuestButton);
      // li.appendChild(this.removeQuestButton);
    }

    this.removeQuestButton.addEventListener("click", () => {
      this.moveQuestToAvailable(questTitle, questFrom);
    });
    this.startQuestButton.addEventListener("click", toggleEditor.bind(this));

    this.ncpQuestMap.set(questTitle, questDesc);
  }

  moveQuestToOngoing(questTitle, questDesc, questFrom) {
    this.popupContainer.style.display = "block";
    // document.getElementById("quest-item").textContent = questTitle;
    this.quests.updateQuestStatus(questTitle, this.quests.status.active);

    console.log(questTitle);
    // var questTitleElement = document.getElementById(questTitle);
    // var questFromElement = document.getElementById(questDesc);
    // console.log(questTitleElement);

    const availableQuestItems = Array.from(this.availableQuests.children);
    const questFromElement = availableQuestItems.find((element) => {
      return element.getAttribute("data-quest-item") === questFrom;
    });

    const questTitleElement = availableQuestItems.find((element) => {
      if (element.getAttribute("id")) {
        console.log(element.getAttribute("id").toString());

        if (element.getAttribute("id").toString() === questTitle.trim()) {
          console.log("test");
          element.textContent = `${questTitle}: ${questDesc}`;
          var br = document.createElement("br");
          element.appendChild(br);

          this.removeQuestButton.addEventListener("click", () => {
            this.moveQuestToAvailable(questTitle, questFrom);
          });
          this.startQuestButton.addEventListener(
            "click",
            toggleEditor.bind(this)
          );

          element.appendChild(this.startQuestButton);
          element.appendChild(this.removeQuestButton);

          this.ongoingQuests.appendChild(element);
          this.ongoingQuests.appendChild(questFromElement);
        }
      }
    });
  }

  moveQuestToAvailable(questTitle, questFrom) {
    toggleEditor(false);

    document.getElementById("quest-item").textContent = questTitle;
    this.quests.updateQuestStatus(questTitle, this.quests.status.inactive);

    var questTitleElement = document.getElementById(questTitle);

    const availableQuestItems = Array.from(this.ongoingQuests.children);
    const questFromElement = availableQuestItems.find((element) => {
      return element.getAttribute("data-quest-item") === questFrom;
    });

    questTitleElement.textContent = `${questTitle}`;
    // var br = document.createElement("br");
    // questTitleElement.appendChild(br);
    // questTitleElement.appendChild(this.startQuestButton);
    // questTitleElement.appendChild(this.removeQuestButton);

    this.availableQuests.appendChild(questTitleElement);
    this.availableQuests.appendChild(questFromElement);
  }
}
