import React, { useEffect, useState } from "react";
import DialogButton from "./DialogButton";
import {
  viewDialogById,
  viewNpcData,
  viewQuestById,
  fetchHelpById,
  fetchDialogByBranch,
  fetchNpcDataById,
  updateCharacterAchievements,
  fetchAchievementById,
} from "../../db/HandleTable";
import TypingAnimation from "./TypingAnimation";
import { animateCameraToTarget } from "../../lib/camera/cameraAnimation";
import ManageQuest from "../../db/ManageQuest";
import { usePlayerContext } from "../../components/PlayerContext";
import { useWorldContext } from "../../components/WorldContext";
import { receiveReward } from "../../lib/ItemsManager";
import { useQuestsData } from "../../components/QuestContext";
import AchievementModal from "../../components/AchievementModal";

const DialogBox = ({
  npc,
  onClose,
  playerInstance,
  cameraInstance,
  cameraControllerInstance,
  onPopupContent,
  onOpenEditor,
  onOpenQuestHint,
  onHighlightQuestHint,
  onSetInteractingNpc,
  setCurrentXpBar,
  updateAvailableQuests,
}) => {
  const manageQuest = new ManageQuest();
  const playerId = localStorage.getItem("playerId");
  const { characterData } = usePlayerContext();
  const { npcs } = useWorldContext();
  const [currentNpcs, setCurrentNpcs] = useState(npcs);

  const [currentTalkingNpc, setCurrentTalkingNpc] = useState(npc);

  const [dialogData, setDialogData] = useState([]);
  const [dialogArray, setDialogArray] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [currentDialog, setCurrentDialog] = useState("");
  const [currentResponses, setCurrentResponses] = useState([]);

  const [typingFinished, setTypingFinished] = useState(false);
  const [skipTypingAnimation, setSkipTypingAnimation] = useState(false);
  const [isPlayerInteractingNpc, setIsPlayerInteractingNpc] = useState(null);
  const [achievementPopup, setAchievementPopup] = useState({
    achievementName: null,
  });

  useEffect(() => {
    setCurrentNpcs(npcs);
    const handlePlayerNpcInteraction = (event) => {
      setIsPlayerInteractingNpc(event.detail);
      cameraControllerInstance.currentTarget = playerInstance;
    };
    document.addEventListener("playerInteractNpc", handlePlayerNpcInteraction);

    return () => {
      document.removeEventListener(
        "playerInteractNpc",
        handlePlayerNpcInteraction
      );
    };
  }, [isPlayerInteractingNpc]);

  const handleTypingFinish = (typing) => {
    setTypingFinished(typing);
  };

  useEffect(() => {
    getNpcDialog()
      .then(([data, questData]) => {
        const dialogWithCharName = data.map((dialogData) => {
          dialogData.dialog = dialogData.dialog.replace(
            "[PlayerIGN]",
            characterData.character_name
              ? characterData.character_name
              : "Player"
          );
          return dialogData;
        });
        // data.map((text) => {
        //   return text[0].dialog.replace(
        //     "[PlayerIGN]",
        //     characterData.character_name
        //   );
        // });

        let dialogArr;
        const startingDialog = dialogWithCharName.filter((dialog) => {
          if (questData[0].quest_status === "inactive") {
            return (
              dialog.stage === "start" &&
              dialog.quest_status_required === "inactive"
            );
          } else if (questData[0].quest_status === "active") {
            return (
              dialog.stage === "start" &&
              dialog.quest_status_required === "active"
            );
          } else if (questData[0].quest_status === "toComplete") {
            return (
              dialog.stage === "start" &&
              dialog.quest_status_required === "toComplete"
            );
          } else {
            return null;
          }
        });
        if (startingDialog[0]) {
          if (startingDialog[0].is_array) {
            dialogArr = startingDialog[0].dialog.split("---");
            setCurrentDialog(dialogArr[0]);
          } else {
            setCurrentDialog(startingDialog[0].dialog);
            setCurrentResponses(
              getCurrentResponses(startingDialog[0].id, dialogWithCharName)
            );
          }
        }

        setDialogData(dialogWithCharName);
        setDialogArray(dialogArr);
        setCurrentId(startingDialog[0].id);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });

    setCurrentTalkingNpc(npc);
    cameraControllerInstance.currentTarget = npc;
    // moveCameraToTarget(playerInstance);
  }, [npc]);

  const moveCameraToTarget = (target) => {
    const distanceToRight = 3.0; // Adjust this distance as needed
    // const combinedPosition = {
    //   x: target.getPosition().x + npc.getPosition().x,
    //   y: target.getPosition().y + 4,
    //   z: target.getPosition().z + npc.getPosition().z,
    // };
    // const targetPosition = {
    //   x: combinedPosition.x + distanceToRight,
    //   y: combinedPosition.y,
    //   z: combinedPosition.z,
    // };
    const targetPosition = {
      x: target.getPosition().x + distanceToRight,
      y: target.getPosition().y + 4,
      z: target.getPosition().z + distanceToRight,
    };

    const animationDuration = 5000;

    animateCameraToTarget(
      cameraControllerInstance,
      targetPosition,
      animationDuration
    );
  };

  const switchCameraTarget = () => {
    if (currentId === 6) {
      cameraControllerInstance.currentTarget = currentTalkingNpc;
      // moveCameraToTarget(playerInstance);
    }
  };

  const currentActiveDialog = () => {
    const data = dialogData.filter((dialog) => dialog.id === currentId);
    return data[0];
  };

  const checkQuestHint = (text) => {
    if (currentActiveDialog().quest_hint_id) {
      onOpenQuestHint(currentActiveDialog().quest_hint_id);
      const angleBracket = text.match(/<([^>]+)>/);

      if (angleBracket) {
        const highlightNum = angleBracket[1];
        onHighlightQuestHint(highlightNum);
      } else {
        onHighlightQuestHint(null);
      }
    } else {
      onOpenQuestHint(null);
    }
  };

  const handleNextDialog = () => {
    if (typingFinished) {
      setSkipTypingAnimation(false);
      try {
        const nextPage = dialogArray.indexOf(currentDialog) + 1;
        let nextText = dialogArray[nextPage];

        checkSpeakingNpc(currentActiveDialog().npc_id);
        if (
          currentActiveDialog().stage === "end" &&
          (nextPage === dialogArray.length ||
            currentActiveDialog().is_array === null)
        ) {
          onClose();
          playerInstance.onNpcZone(null);
          playerInstance.finishedTalking = true;
          setCurrentId(0);
          onOpenQuestHint(null);
          if (currentActiveDialog().open_editor) {
            onOpenEditor(npc.currentQuest.data);
          }
        }

        checkQuestHint(nextText);

        if (nextPage + 1 < dialogArray.length) {
          setCurrentDialog(nextText);
          setCurrentResponses([]);
        } else {
          if (currentActiveDialog().open_editor) {
            // if (
            //   npc.currentQuest.data.quest_status === manageQuest.status.active
            // ) {
            onOpenEditor(npc.currentQuest.data);
            // }
          }
          setCurrentDialog(nextText);
          setCurrentResponses(getCurrentResponses(currentId));
          switchCameraTarget();
          if (nextText === undefined) {
            onClose();
            playerInstance.onNpcZone(null);
            playerInstance.finishedTalking = true;
            onOpenQuestHint(null);
          }
        }
      } catch (error) {
        console.log(error);
        if (currentActiveDialog().open_editor) {
          onOpenEditor(npc.currentQuest.data);
        }
        onClose();
        playerInstance.onNpcZone(null);
        playerInstance.finishedTalking = true;
      }
    } else {
      setSkipTypingAnimation(true);
      setTypingFinished(true);
    }
  };

  const convertToArray = ({ dialog, id }) => {
    if (id !== currentId) {
      const result = dialog.split("---");
      setCurrentDialog(result[0]);
      setDialogArray(result);
      setCurrentResponses([]);
    }
  };

  const getCurrentResponses = (id, data = dialogData) => {
    const responses = data.filter((dialog) => {
      const jsArray = dialog.response_to;
      if (!Array.isArray(jsArray)) {
        return false;
      }
      return jsArray.includes(id);
    });
    return responses;
  };

  const getAllResponse = ({ id }) => {
    const nextDialogObj = getCurrentResponses(id);

    setCurrentResponses(getCurrentResponses(nextDialogObj[0].id));
    return nextDialogObj[0];
  };

  const handleResponse = ({ id, quest_id }) => {
    setSkipTypingAnimation(false);
    if (quest_id) {
      acceptQuest(quest_id);
    }
    if (currentActiveDialog().open_editor) {
      onOpenEditor(npc.currentQuest.data);
    }
    try {
      const nextNpcDialog = getAllResponse({ id: id });
      checkSpeakingNpc(nextNpcDialog.npc_id);
      if (nextNpcDialog.is_array) {
        convertToArray({ dialog: nextNpcDialog.dialog, id: id });
      } else {
        setCurrentDialog(nextNpcDialog.dialog);
      }
      openHelp(nextNpcDialog.id);
      setCurrentId(nextNpcDialog.id);
    } catch (e) {
      onClose();
      onOpenQuestHint(null);
    }
  };

  const openHelp = (id) => {
    const res = dialogData.filter((dialog) => {
      return dialog.id === id;
    });
    if (res[0].open_helper_id) {
      getHelpById(res[0].open_helper_id)
        .then((result) => {
          // setDialogData(result[0].dialog);
          const talkingNpc = npcs.filter((item) => {
            return item.npcName === result[0].npc_name;
          });
          setCurrentTalkingNpc(talkingNpc);
          // setCurrentId(result[0].id);
          // setCurrentResponses([]);
          // setDialogArray(result[0].dialog);
          // setCurrentDialog(result[0].dialog[0]);
          // moveCameraToTarget(playerInstance);
          // cameraControllerInstance.currentTarget = playerInstance;
          // setIsPlayerInteractingNpc(npcs.albyNPC);

          onOpenQuestHint(result[0].quest_hint_id);
          // onSetInteractingNpc(npcs.albyNPC);
          // playerInstance.onNpcZone(npcs.albyNPC);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const getHelpById = async (id) => {
    try {
      const help = await fetchHelpById(id);
      return help;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  const acceptQuest = async (quest_id) => {
    try {
      // const quest = await manageQuest.getQuestDataById(quest_id);
      const quest = await manageQuest.getQuestByQuestId(quest_id);
      const status = manageQuest.status;
      let newStatus;
      let headerText;
      if (quest[0].quest_status === status.inactive) {
        newStatus = status.active;
        headerText = "Quest Started";
        manageQuest.acceptQuest(quest_id, quest[0]);
        npc.currentQuestStatus.stats = "active";
      } else if (quest[0].quest_status === status.toComplete) {
        newStatus = status.completed;
        headerText = "Quest Completed";
        manageQuest.completedQuest(
          npc.npcData[0].id,
          quest[0],
          quest_id,
          npc.npcData[0].dialog_id
        );
        npc.currentQuestStatus.stats = "completed";
        viewQuests()
          .then((data) => {
            updateAvailableQuests(data);
          })
          .catch((error) => {
            console.log(error);
          });
        if (quest[0].next_quest_id) {
          const nextQuest = await manageQuest.getQuestByQuestId(
            quest[0].next_quest_id
          );
          const nextNpc = currentNpcs.filter((item) => {
            let npc = false;
            if (item.npcData && item.npcData[0] !== undefined) {
              return item.npcData[0].npc_id === nextQuest[0].npc_id;
            }
            return npc;
          });
          const questData = await viewQuestById(nextQuest[0].quest_id);
          nextNpc[0].currentQuest.data = questData[0];
          nextNpc[0].currentQuestStatus.stats = "inactive";
          nextNpc[0].setQuestIcon(
            questData[0].quest_type,
            questData[0].quest_status
          );
        }
        if (quest_id === 3) {
          showNewAchievement(1);
          updateCharacterAchievements(localStorage.getItem("playerId"), 1)
            .then((result) => {
              console.log("SHOULD SHOW HERE");
              // showNewAchievement(1);
            })
            .catch((error) => {
              console.log(error);
            });
        }
        receiveReward(quest[0].reward)
          .then(() => {
            console.log("Rewards gained: ", quest[0].reward);
            setCurrentXpBar(
              (characterData.xp.current_xp / characterData.xp.max_xp) * 200
            );
          })
          .catch((error) => {
            console.log("Error in receiving rewards: ", error);
          });
      }
      onPopupContent(
        headerText,
        quest[0].quest_title,
        quest[0].quest_description
      );
    } catch (error) {
      console.error("Error accepting the quest:", error);
      throw error;
    }
  };

  const getNpcDialog = async () => {
    try {
      const npcData = await viewNpcData(currentTalkingNpc.npcName, playerId);
      const dialog = await viewDialogById(npcData[0].npc_id);
      const questData = await manageQuest.getQuestByQuestId(
        npc.currentQuest.data.quest_id
      );
      const data = await fetchDialogByBranch(dialog[0].dialog_branch);
      return [data, questData];
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  const checkSpeakingNpc = (id) => {
    getNpcData(id)
      .then((result) => {
        if (currentTalkingNpc.npcName !== result[0].npc_name) {
          const talkingNpc = npcs.filter((item) => {
            return item.npcName === result[0].npc_name;
          });
          setCurrentTalkingNpc(talkingNpc[0]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNpcData = async (id) => {
    try {
      const data = await fetchNpcDataById(id);
      return data;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  const viewQuests = async () => {
    try {
      const quests = await manageQuest.getPlayerQuests();
      return quests;
    } catch (error) {
      console.error("InterfaceHandler.jsx error viewing the quests: ", error);
      throw error;
    }
  };

  const showNewAchievement = (achievement_id) => {
    setAchievementPopup({
      achievementName: "Hello world!",
    });
    // fetchAchievementById(achievement_id)
    //   .then((result) => {
    //     console.log("SHOULD SHOW HERE: ", result);
    //     setAchievementPopup({
    //       achievementName: result[0].name,
    //     });
    //   })
    //   .catch((error) => {
    //     console.log("Error on fetching achievement: ", error);
    //   });
  };

  return (
    <div className="dialog-main-container">
      {achievementPopup.achievementName ? (
        <AchievementModal
          achievementName={achievementPopup.achievementName}
          onClose={() => {
            setAchievementPopup({
              achievementName: null,
            });
          }}
        />
      ) : null}
      <div className="dialog-responses-container">
        {typingFinished &&
          currentResponses.length > 0 &&
          currentResponses.map((response, index) => (
            <DialogButton
              key={index}
              text={response.dialog}
              event={() => handleResponse(response, response.quest_id)}
            />
          ))}
      </div>
      <div className="npc-dialog-container">
        <div className="npc-dialog-name">
          {currentTalkingNpc ? <p>{currentTalkingNpc.npcName}</p> : null}
        </div>
        <div className="npc-dialog-text">
          <TypingAnimation
            text={currentDialog}
            delay={30}
            onFinishedTyping={handleTypingFinish}
            skipAnimation={skipTypingAnimation}
          />
        </div>
        <div className="npc-dialog-button-container">
          {typingFinished && currentResponses.length > 0 ? null : (
            <DialogButton text={"Next"} event={handleNextDialog} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DialogBox;
