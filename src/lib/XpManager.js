import { updateCharacterCurrentXp } from "../db/HandleTable";

export async function receiveXp(value) {
  try {
    const playerId = localStorage.getItem("playerId");
    await updateCharacterCurrentXp(playerId, value);
  } catch (error) {
    console.log(error);
  }
}
