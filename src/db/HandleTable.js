const host = "http://127.0.0.1:3000/";
const npcAPI = host + "npc";
const questAPI = host + "quests";
const dialogAPI = host + "dialog";

export function addNpcToTable(npc_name, quest_title, dialog) {
  fetch(npcAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      npc_name: npc_name,
      quest_title: quest_title,
      dialog: dialog,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error creating new npc: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("New npc created successfully:", data);
      // Perform any necessary UI updates after successful creation
      // ...
    })
    .catch((error) => {
      console.error(error);
    });
}

export function fetchNpcTable() {
  fetch(npcAPI)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function fetchNpcQuestDialog() {
  return fetch(npcAPI + "-quest-dialog")
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Error fetching NPC quest dialog data: " + response.statusText
        );
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

export function fetchNpcDataByName(name) {
  return fetch(npcAPI + "/get-npc/" + name)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching NPC data: " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

export function updateQuestDataStatus(quest_title, quest_status) {
  return new Promise((resolve, reject) => {
    fetch(questAPI + "-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quest_title: quest_title,
        quest_status: quest_status,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Error updating quest status: " + response.statusText
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Quest status updated successfully:", data);
        resolve();
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}

export function addQuestToTable(from, title, description, status, type) {
  fetch(questAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assigned_npc: from,
      quest_title: title,
      quest_description: description,
      quest_status: status,
      quest_type: type,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("New quest created successfully:", data);
    })
    .catch((error) => {
      console.error("Error creating new quest:", error);
    });
}

export function fetchQuestTable() {
  fetch(questAPI)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Assuming the response is an array of quest objects
      // Update the UI with the retrieved data
      // ...
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export function addDialogToTable(npc_name, dialog, quest_title) {
  return new Promise((resolve, reject) => {
    fetch(dialogAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        npc_name: npc_name,
        dialog: dialog,
        quest_title: quest_title,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error creating new dialog: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        console.log("New dialog created successfully:", data);
        // Perform any necessary UI updates after successful creation
        // ...
        resolve(); // Resolve the promise when the operations are completed
      })
      .catch((error) => {
        console.error(error);
        reject(error); // Reject the promise if an error occurs
      });
  });
}

export function fetchDialogTable() {
  fetch(dialogAPI)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
