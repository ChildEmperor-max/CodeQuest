import toggleEditor from "../Editor";
import Quests from "../db/ManageQuest";
import { fetchNpcQuestDialog, fetchQuestTable } from "../db/HandleTable";

export default class QuestManager {
  constructor() {
    this.quests = new Quests();
    this.questBox = document.getElementById("questBox");
    this.shown = false;
    this.ncpQuestMap = new Map();
    this.addedStartQuestListener = false;

    // Get the quest items in both sections
    this.storyQuestList = document.getElementById("StoryQuestList");
    this.availableQuests = document.getElementById("Available");
    this.ongoingQuests = document.getElementById("Ongoing");

    this.popupContainer = document.getElementById("popupContainer");
    this.closePopupButton = document.getElementById("closeButton");

    this.startQuestButton = document.createElement("button");
    this.removeQuestButton = document.createElement("button");
    this.startQuestButton.style.display = "none";
    this.removeQuestButton.style.display = "none";
  }
  toggleQuestBox() {
    const viewQuestData = async () => {
      try {
        const npcData = await fetchNpcQuestDialog();
        // npcData.forEach((element) => {
        //   if (element.quest_status.trim() === this.quests.status.completed) {
        //     this.moveQuestToCompleted(element.quest_title.trim());
        //   }
        // });
      } catch (error) {
        console.error("[ERROR]:", error);
      }
    };
    viewQuestData();

    let questBox = document.getElementById("questBox");
    let popupContainer = document.getElementById("popupContainer");
    questBox.classList.toggle("hidden");

    // quest accepted popup hide on opening quest box
    if (questBox.classList.contains("hidden")) {
      questBox.style.display = "none";
    } else {
      questBox.style.display = "block";
      popupContainer.classList.add("fadeOut");
      setTimeout(() => {
        popupContainer.style.display = "none";
        popupContainer.classList.remove("fadeOut");
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
    // this.startQuestButton = document.createElement("button");
    this.startQuestButton.textContent = "Start";
    this.startQuestButton.style.display = "none";
    this.startQuestButton.setAttribute("class", "quest-list-button");
    // this.removeQuestButton = document.createElement("button");
    this.removeQuestButton.textContent = "Abandon";
    this.removeQuestButton.style.display = "none";
    this.removeQuestButton.setAttribute("class", "quest-list-button");

    this.closePopupButton.addEventListener("click", () => {
      this.popupContainer.classList.add("fadeOut");
      setTimeout(() => {
        this.popupContainer.style.display = "none";
        this.popupContainer.classList.remove("fadeOut");
      }, 800);
    });

    this.closeQuestButton = document.getElementById("close-quest-button");
    this.closeQuestButton.addEventListener(
      "click",
      this.toggleQuestBox.bind(this)
    );
    const addNpcQuestData = async () => {
      try {
        const npcData = await fetchNpcQuestDialog();
        npcData.forEach((element) => {
          this.addQuestItem(
            element.quest_description,
            element.quest_title,
            element.npc_name,
            element.quest_type,
            element.quest_status,
            element.code_template,
            element.quest_answer
          );
        });
      } catch (error) {
        console.error("[ERROR]:", error);
      }
    };

    // addNpcQuestData();
  }

  addQuestItem(
    questDesc,
    questTitle,
    questFrom,
    questType,
    questStatus,
    codeTemplate,
    questAnswer
  ) {
    questTitle = questTitle.trim();
    questStatus = questStatus.trim();
    questDesc = questDesc.trim();
    questFrom = questFrom.trim();
    questType = questType.trim();
    codeTemplate = codeTemplate.trim();
    questAnswer = questAnswer.trim();
    const li = document.createElement("li");
    const pi = document.createElement("span");
    li.textContent = `${questTitle}`;
    pi.textContent = `${questFrom}`;
    li.setAttribute("id", questTitle); // Set the questTitle as the id
    pi.setAttribute("data-quest-item", questTitle);

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
    this.removeQuestButton.textContent = "Abandon";
    this.removeQuestButton.style.display = "none";
    this.removeQuestButton.setAttribute("class", "quest-list-button");
    if (
      questStatus === this.quests.status.active &&
      questType === this.quests.type.side
    ) {
      this.ongoingQuests.appendChild(li);
      this.ongoingQuests.appendChild(pi);
      li.textContent = `${questTitle}: ${questDesc}`;
      var br = document.createElement("br");
      li.appendChild(br);
      li.appendChild(this.startQuestButton);
      li.appendChild(this.removeQuestButton);

      this.removeQuestButton.addEventListener("click", () => {
        this.moveQuestToAvailable(questTitle, questFrom);
      });
      this.startQuestButton.addEventListener("click", () => {
        toggleEditor({
          quest_title: questTitle,
          quest_description: questDesc,
          quest_from: questFrom,
          code_template: codeTemplate,
          quest_answer: questAnswer,
        });
      });
    } else if (
      questStatus === this.quests.status.inactive &&
      questType === this.quests.type.side
    ) {
      this.availableQuests.appendChild(li);
      this.availableQuests.appendChild(pi);
      // li.appendChild(this.startQuestButton);
      // li.appendChild(this.removeQuestButton);
    } else if (questType === this.quests.type.story) {
      this.storyQuestList.appendChild(li);
      this.storyQuestList.appendChild(pi);
      li.textContent = `${questTitle}`;
      var br = document.createElement("br");
      li.appendChild(br);
      li.appendChild(this.startQuestButton);
      li.appendChild(this.removeQuestButton);

      this.removeQuestButton.addEventListener("click", () => {
        this.moveQuestToAvailable(questTitle, questFrom);
      });
      this.startQuestButton.addEventListener("click", () => {
        toggleEditor({
          quest_title: questTitle,
          quest_description: questDesc,
          quest_from: questFrom,
          code_template: codeTemplate,
          quest_answer: questAnswer,
        });
      });
    }

    this.ncpQuestMap.set(questTitle, questDesc);
  }

  moveQuestToOngoing(
    questTitle,
    questDesc,
    questFrom,
    codeTemplate,
    questAnswer
  ) {
    this.popupContainer.style.display = "block";
    document.getElementById("popup-text-header").textContent =
      "New Quest accepted";
    document.getElementById("quest-item").textContent = questTitle;
    this.quests.updateQuestStatus(questTitle, this.quests.status.active);

    const availableQuestItems = Array.from(this.availableQuests.children);
    const questFromElement = availableQuestItems.find((element) => {
      return element.getAttribute("data-quest-item") === questTitle.trim();
    });

    availableQuestItems.find((element) => {
      if (element.getAttribute("id")) {
        if (element.getAttribute("id").toString() === questTitle.trim()) {
          element.textContent = `${questTitle}: ${questDesc}`;
          var br = document.createElement("br");
          element.appendChild(br);
          element.appendChild(this.startQuestButton);
          element.appendChild(this.removeQuestButton);

          if (!this.addedStartQuestListener) {
            this.removeQuestButton.addEventListener("click", () => {
              this.moveQuestToAvailable(questTitle, questFrom);
            });
            this.startQuestButton.addEventListener("click", () => {
              toggleEditor({
                quest_title: questTitle,
                quest_description: questDesc,
                quest_from: questFrom,
                code_template: codeTemplate,
                quest_answer: questAnswer,
              });
            });
            this.addedStartQuestListener = true;
          }

          this.ongoingQuests.appendChild(element);
          this.ongoingQuests.appendChild(questFromElement);
        }
      }
    });
  }

  moveQuestToAvailable(questTitle, questFrom) {
    toggleEditor({
      quest_title: null,
      quest_description: null,
      quest_from: null,
      code_template: null,
      quest_answer: null,
      setVisible: false,
    });

    this.quests.updateQuestStatus(questTitle, this.quests.status.inactive);
    this.popupContainer.style.display = "block";
    document.getElementById("popup-text-header").textContent =
      "Abandoned quest";
    document.getElementById("quest-item").textContent = questTitle;

    const availableQuestItems = Array.from(this.ongoingQuests.children);
    const questFromElement = availableQuestItems.find((element) => {
      return element.getAttribute("data-quest-item") === questTitle.trim();
    });

    availableQuestItems.find((element) => {
      if (element.getAttribute("id")) {
        if (element.getAttribute("id").toString() === questTitle.trim()) {
          element.textContent = `${questTitle} `;
          this.availableQuests.appendChild(element);
          this.availableQuests.appendChild(questFromElement);
        }
      }
    });
  }

  moveQuestToCompleted(questTitle) {
    // toggleEditor({
    //   quest_title: questTitle,
    //   quest_description: null,
    //   quest_from: null,
    //   code_template: null,
    //   quest_answer: null,
    //   setVisible: false,
    // });
    document.getElementById("popupContainer").style.display = "block";
    document.getElementById("popup-text-header").textContent =
      "Quest completed";
    document.getElementById("quest-item").textContent = questTitle;
    this.quests.updateQuestStatus(questTitle, this.quests.status.completed);

    const ongoingQuests = Array.from(this.ongoingQuests.children);
    const questFromElement = ongoingQuests.find((element) => {
      return element.getAttribute("data-quest-item") === questTitle.trim();
    });

    ongoingQuests.find((element) => {
      if (element.getAttribute("id")) {
        if (element.getAttribute("id").toString() === questTitle.trim()) {
          element.textContent = `${questTitle} `;
          this.ongoingQuests.removeChild(element);
          this.ongoingQuests.removeChild(questFromElement);
        }
      }
    });
  }

  showWrongAnswerPopup() {
    document.getElementById("popupContainer").style.display = "block";
    document.getElementById("popup-text-header").textContent = "Wrong Answer!";
    document.getElementById("quest-item").textContent =
      "Make sure to follow the instructions!";
  }
}
