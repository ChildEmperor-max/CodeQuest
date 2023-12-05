import {
  updateCharacterCurrentXp,
  updateCharacterGold,
} from "../db/HandleTable";

export const OPERATION = {
  ADD: "add",
  MINUS: "minus",
  TIMES: "times",
  DIVIDE: "divide",
};

export async function receiveReward(reward) {
  try {
    const playerId = localStorage.getItem("playerId");
    await updateCharacterCurrentXp(playerId, reward.xp);
    if (reward.gold) {
      await updateGold(reward.gold, OPERATION.ADD);
    }
  } catch (error) {
    console.log(error);
  }
}

export async function updateGold(value, operation) {
  try {
    const playerId = localStorage.getItem("playerId");
    await updateCharacterGold(playerId, value, operation);
  } catch (error) {
    console.log(error);
  }
}
