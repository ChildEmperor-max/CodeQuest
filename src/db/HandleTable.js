// const host = "http://localhost:3000/";
const host = "http://127.0.0.1:3000/";
const npcAPI = host + "npc";
const questAPI = host + "quests";
const dialogAPI = host + "dialog";
const achievementsAPI = host + "achievements";

export function executeJavaCode(data) {
  return fetch(host + "execute-java", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.error) {
        if (result.compilationError) {
          console.error(
            "Java code compilation error:",
            result.compilationError
          );
          result.error = result.compilationError;
        } else if (result.executionError) {
          console.error("Java code execution error:", result.executionError);
          result.error = result.executionError;
        } else {
          console.error("Unknown error occurred during Java code execution");
          result.error = "Unknown error occurred during Java code execution";
        }
      }
      return result;
    })
    .catch((error) => {
      console.error("Error executing Java code:", error);
      throw error;
    });
}

export const viewNpcData = async (name) => {
  try {
    const npcData = await fetchNpcDataByName(name);
    return npcData;
  } catch (error) {
    console.error("[ERROR]:", error);
  }
};

export const viewNpcIdByName = async (name) => {
  try {
    const npcData = await fetchNpcIdByName(name);
    return npcData;
  } catch (error) {
    console.error("[ERROR]:", error);
  }
};

export const viewDialogById = async (id) => {
  try {
    const npcData = await fetchDialogByNpcId(id);
    return npcData;
  } catch (error) {
    console.error("[ERROR]:", error);
  }
};

export const viewQuestById = async (id) => {
  try {
    const questData = await fetchQuestById(id);
    return questData;
  } catch (error) {
    console.error("[ERROR]:", error);
  }
};

export const viewDialogData = async (id) => {
  try {
    const dialogData = await fetchDialogById(id);
    return dialogData;
  } catch (error) {
    console.error("[ERROR]:", error);
  }
};

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

export function fetchNpcQuestDialogById(id) {
  return fetch(`${npcAPI}-get-quest-dialog/${id}`)
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

export function fetchNpcIdByName(name) {
  return fetch(npcAPI + "/get-npc-id/" + name)
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

export function fetchQuestById(id) {
  return fetch(questAPI + "/get-quest/" + id)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching quest data: " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

export function fetchDialogById(id) {
  return fetch(dialogAPI + "/get-dialog/" + id)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching Dialog data: " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}

export function updateQuestDataStatus(quest_id, quest_status) {
  return new Promise((resolve, reject) => {
    fetch(questAPI + "-update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        quest_id: quest_id,
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

export async function fetchQuestTable() {
  try {
    const response = await fetch(questAPI);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function fetchAchievements() {
  try {
    const response = await fetch(achievementsAPI);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function fetchCompletedQuests() {
  try {
    const response = await fetch(questAPI + "/completed");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export async function fetchCompletedQuestCount() {
  try {
    const response = await fetch(questAPI + "/completed/count");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
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

export function fetchDialogByNpcId(id) {
  return fetch(dialogAPI + "/get-dialog-by-id/" + id)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error fetching Dialog data: " + response.statusText);
      }
      return response.json();
    })
    .catch((error) => {
      console.error("Error:", error);
      throw error;
    });
}
