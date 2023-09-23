import React, { useEffect, useState } from "react";
import DialogButton from "./DialogButton";
import {
  viewDialogById,
  viewNpcData,
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
  onQuestStarted,
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
      .then((allDialog) => {
        let dialogArr;
        const data = allDialog.filter((dialog) => dialog.stage === "start");

        if (data[0].is_array) {
          dialogArr = data[0].dialog.split("---");
          setCurrentDialog(dialogArr[0]);
        } else {
          setCurrentDialog(data[0].dialog);
          setCurrentResponses(getCurrentResponses(data[0].id, data));
        }

        setDialogData(allDialog);
        setDialogArray(dialogArr);
        setCurrentId(data[0].id);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });

    setCurrentTalkingNpc(npc);

    cameraControllerInstance.currentTarget = npc;
    moveCameraToTarget(playerInstance, 3);
  }, [npc]);

  const moveCameraToTarget = (target, offset) => {
    const targetPosition = {
      x: target.getPosition().x + offset,
      y: target.getPosition().y + 5,
      z: target.getPosition().z + offset,
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
      moveCameraToTarget(playerInstance, 2);
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
        }

        checkQuestHint(nextText);

        if (nextPage + 1 < dialogArray.length) {
          setCurrentDialog(nextText);
          setCurrentResponses([]);
        } else {
          if (currentActiveDialog().open_editor) {
            if (
              npc.currentQuest[0].quest_status === manageQuest.status.active
            ) {
              onOpenEditor(npc.currentQuest[0]);
            }
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
          // moveCameraToTarget(playerInstance, 3);
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
      manageQuest.updateQuestStatus(quest_id, manageQuest.status.active);
      onQuestStarted(quest[0].quest_title, quest[0].quest_description);
    } catch (error) {
      console.error("Error accepting the quest:", error);
      throw error;
    }
  };

  const getNpcDialog = async () => {
    try {
      const npcData = await viewNpcData(currentTalkingNpc.npcName);
      const dialog = await viewDialogById(npcData[0].id);
      const data = await fetchDialogByBranch(dialog[0].dialog_branch);
      return data;
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
