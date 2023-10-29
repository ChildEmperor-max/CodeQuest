import { updateCharacterCurrentXp } from "../db/HandleTable";

export function receiveXp(value) {
  const playerId = localStorage.getItem("playerId");

  updateCharacterCurrentXp(playerId, value)
    .then(() => {
      console.log("xp gained: ", value);
    })
    .catch((err) => {
      console.log(err);
    });
}
