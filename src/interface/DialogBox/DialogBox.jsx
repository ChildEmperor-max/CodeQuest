import React, { useEffect, useState } from "react";
import DialogButton from "./DialogButton";
import { viewDialogById, viewNpcData } from "../../db/HandleTable";
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
}) => {
  const questManager = new ManageQuest();
  const [currentTalkingNpc, setCurrentTalkingNpc] = useState(null);

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
      .then((data) => {
        let dialogArr;
        if (data[0].is_array) {
          dialogArr = data[0].dialog.split("---");
          setCurrentDialog(dialogArr[0]);
        } else {
          setCurrentDialog(data[0].dialog);
          // const responses = data.filter(
          //   (dialog) => dialog.response_to === data[0].id
          // );

          const responses = data.filter((dialog) => {
            const jsArray = dialog.response_to;
            if (!Array.isArray(jsArray)) {
              return false;
            }
            return jsArray.includes(data[0].id);
          });

          setCurrentResponses(responses);
        }

        setDialogData(data);
        setDialogArray(dialogArr);
        setCurrentId(1);

        // playTypingAnimation(currentDialog);
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

  const convertToArray = ({ dialog, id }) => {
    if (id !== currentId) {
      const result = dialog.split("---");
      setCurrentDialog(result[0]);
      setDialogArray(result);
      setCurrentResponses([]);
    }
  };

  const getAllResponse = ({ id }) => {
    // const nextDialogObj = dialogData.find(
    //   (dialog) => dialog.response_to === id
    // );
    const nextDialogObj = dialogData.filter((dialog) => {
      const jsArray = dialog.response_to;
      if (!Array.isArray(jsArray)) {
        return false;
      }
      return jsArray.includes(id);
    });
    // const responses = dialogData.filter(
    //   (dialog) => dialog.response_to === nextDialogObj.id
    // );
    const responses = dialogData.filter((dialog) => {
      const jsArray = dialog.response_to;
      if (!Array.isArray(jsArray)) {
        return false;
      }
      return jsArray.includes(nextDialogObj[0].id);
    });

    setCurrentResponses(responses);
    return nextDialogObj[0];
  };

  const handleNextDialog = () => {
    if (typingFinished) {
      setSkipTypingAnimation(false);
      try {
        const nextPage = dialogArray.indexOf(currentDialog) + 1;

        const currentActiveDialog = dialogData.filter(
          (dialog) => dialog.id === currentId
        );
        if (
          currentActiveDialog[0].stage === "end" &&
          nextPage + 1 < dialogArray.length
        ) {
          onClose();
          playerInstance.onNpcZone(null);
          setCurrentId(0);
        }

        if (nextPage + 1 < dialogArray.length) {
          setCurrentDialog(dialogArray[nextPage]);
          setCurrentResponses([]);
        } else {
          setCurrentDialog(dialogArray[nextPage]);
          // const responses = dialogData.filter(
          //   (dialog) => dialog.response_to === currentId
          // );
          const responses = dialogData.filter((dialog) => {
            const jsArray = dialog.response_to;
            if (!Array.isArray(jsArray)) {
              return false;
            }
            return jsArray.includes(currentId);
          });

          setCurrentResponses(responses);
          switchCameraTarget();
          if (dialogArray[nextPage] === undefined) {
            onClose();
            playerInstance.onNpcZone(null);
          }
        }
      } catch (error) {
        onClose();
        console.log(
          "Error[NOT SEVERE]: Tried to show a nonexistent dialog page. This is to hide the dialog box when there is no next dialog."
        );
        playerInstance.onNpcZone(null);
      }
    } else {
      setSkipTypingAnimation(true);
      setTypingFinished(true);
    }
  };

  const handleResponse = ({ id, quest_id }) => {
    setSkipTypingAnimation(false);
    const nextNpcDialog = getAllResponse({ id: id });
    if (nextNpcDialog.is_array) {
      convertToArray({ dialog: nextNpcDialog.dialog, id: id });
    } else {
      setCurrentDialog(nextNpcDialog.dialog);
    }
    if (quest_id) {
      acceptQuest(quest_id);
    }
    setCurrentId(nextNpcDialog.id);
  };

  const acceptQuest = async (quest_id) => {
    try {
      const quest = await questManager.getQuestDataById(quest_id);
      questManager.updateQuestStatus(quest_id, questManager.status.active);
      onQuestStarted(quest[0].quest_title);
    } catch (error) {
      console.error("Error accepting the quest:", error);
      throw error;
    }
  };

  const getNpcDialog = async () => {
    try {
      const npcData = await viewNpcData(npc.npcName);
      const dialog = await viewDialogById(npcData[0].id);
      return dialog;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  return (
    <div className="npc-dialog-container">
      <div className="npc-dialog-name">{npc ? <p>{npc.npcName}</p> : null}</div>
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
