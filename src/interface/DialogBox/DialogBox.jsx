import React, { useEffect, useState } from "react";
import DialogButton from "./DialogButton";
import {
  viewDialogById,
  viewNpcData,
  viewQuestById,
  fetchHelpById,
  fetchDialogByBranch,
  fetchNpcDataById,
} from "../../db/HandleTable";
import TypingAnimation from "./TypingAnimation";
import { animateCameraToTarget } from "../../lib/cameraAnimation";
import ManageQuest from "../../db/ManageQuest";

const DialogBox = ({
  npc,
  onClose,
  playerInstance,
  npcInstances,
  cameraInstance,
  cameraControllerInstance,
  onPopupContent,
  onOpenEditor,
  onOpenQuestHint,
  onHighlightQuestHint,
  onSetInteractingNpc,
}) => {
  const manageQuest = new ManageQuest();
  const [currentTalkingNpc, setCurrentTalkingNpc] = useState(npc);

  const [dialogData, setDialogData] = useState([]);
  const [dialogArray, setDialogArray] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [currentDialog, setCurrentDialog] = useState("");
  const [currentResponses, setCurrentResponses] = useState([]);

  const [typingFinished, setTypingFinished] = useState(false);
  const [skipTypingAnimation, setSkipTypingAnimation] = useState(false);
  const [isPlayerInteractingNpc, setIsPlayerInteractingNpc] = useState(null);

  useEffect(() => {
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
        let dialogArr;
        const startingDialog = data.filter((dialog) => {
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
          }
        });
        if (startingDialog[0].is_array) {
          dialogArr = startingDialog[0].dialog.split("---");
          setCurrentDialog(dialogArr[0]);
        } else {
          setCurrentDialog(startingDialog[0].dialog);
          setCurrentResponses(getCurrentResponses(startingDialog[0].id, data));
        }

        setDialogData(data);
        setDialogArray(dialogArr);
        setCurrentId(startingDialog[0].id);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });

    setCurrentTalkingNpc(npc);

    cameraControllerInstance.currentTarget = npc;
    moveCameraToTarget(playerInstance);
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
      moveCameraToTarget(playerInstance);
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
          setCurrentId(0);
          onOpenQuestHint(null);
          if (currentActiveDialog().open_editor) {
            onOpenEditor(npc.currentQuest[0]);
          }
        }

        checkQuestHint(nextText);

        
        if (nextPage + 1 < dialogArray.length) {
          setCurrentDialog(nextText);
          setCurrentResponses([]);
        } else {
          if (currentActiveDialog().open_editor) {
            // if (
            //   npc.currentQuest[0].quest_status === manageQuest.status.active
            // ) {
            onOpenEditor(npc.currentQuest[0]);
            // }
          }
          setCurrentDialog(nextText);
          setCurrentResponses(getCurrentResponses(currentId));
          switchCameraTarget();
          if (nextText === undefined) {
            onClose();
            playerInstance.onNpcZone(null);
            onOpenQuestHint(null);
          }
        }
      } catch (error) {
        console.log(error);
        if (currentActiveDialog().open_editor) {
          onOpenEditor(npc.currentQuest[0]);
        }
        onClose();
        playerInstance.onNpcZone(null);
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
      onOpenEditor(npc.currentQuest[0]);
    }
    try {
      const nextNpcDialog = getAllResponse({ id: id });
      checkSpeakingNpc(nextNpcDialog.npc_id);
      if (nextNpcDialog.is_array) {
        convertToArray({ dialog: nextNpcDialog.dialog, id: id });
      } else {
        setCurrentDialog(nextNpcDialog.dialog);
      }
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
          const albyNPC = npcInstances.filter((item) => {
            return item.npcName === "Alby";
          });
          setDialogData(result[0].description);
          setCurrentTalkingNpc(albyNPC);
          setCurrentResponses([]);
          setDialogArray(result[0].description);
          setCurrentDialog(result[0].description[0]);
          // moveCameraToTarget(playerInstance);
          // cameraControllerInstance.currentTarget = playerInstance;
          setIsPlayerInteractingNpc(albyNPC);

          onOpenQuestHint(result[0].quest_hint_id);
          onSetInteractingNpc(albyNPC);
          playerInstance.onNpcZone(albyNPC);
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
      const quest = await manageQuest.getQuestDataById(quest_id);
      const status = manageQuest.status;
      let newStatus;
      let headerText;
      if (quest[0].quest_status === status.inactive) {
        newStatus = status.active;
        headerText = "Quest Started";
      } else if (quest[0].quest_status === status.toComplete) {
        newStatus = status.completed;
        headerText = "Quest Completed";
      }
      manageQuest.updateQuestStatus(quest_id, newStatus);
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
      const npcData = await viewNpcData(currentTalkingNpc.npcName);
      const dialog = await viewDialogById(npcData[0].id);
      const questData = await viewQuestById(npc.currentQuest[0].id);
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
          const talkingNpc = npcInstances.filter((item) => {
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

  return (
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
        {currentResponses.length > 0 && typingFinished ? (
          currentResponses.map((response, index) => (
            <DialogButton
              key={index}
              text={response.dialog}
              event={() => handleResponse(response, response.quest_id)}
            />
          ))
        ) : (
          <DialogButton text={"Next"} event={handleNextDialog} />
        )}
      </div>
    </div>
  );
};

export default DialogBox;
