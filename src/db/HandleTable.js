const host = "http://127.0.0.1:3000/";
const npcAPI = host + "npc";
const questAPI = host + "quests";
const dialogAPI = host + "dialog";

export function addNpcToTable(npc_name) {
  fetch(npcAPI, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      npc_name: npc_name,
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

export function addQuestToTable(from, title, description, status, type) {
  fetch(questAPI, {
    method: "POST", // Use the POST method to create a new entry
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Provide the new quest data as the payload
      assigned_npc: from,
      quest_title: title,
      quest_description: description,
      quest_status: status,
      quest_type: type,
      // Add other properties for the new quest
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("New quest created successfully:", data);
      // Perform any necessary UI updates after successful creation
      // ...
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
    })
    .catch((error) => {
      console.error(error);
    });
}
