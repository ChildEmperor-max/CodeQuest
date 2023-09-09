import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  viewNpcIdByName,
  viewDialogById,
  viewNpcData,
} from "../../db/HandleTable";

const DialogBox = ({ npc_name, onClose, playerInstance, npcInstances, cameraInstance, cameraControllerInstance }) => {
  const [currentTalkingNpc, setCurrentTalkingNpc] = useState(null);
  const [isPlayerInteractingNpc, setIsPlayerInteractingNpc] = useState(null);

  const [dialogData, setDialogData] = useState([]);
  const [dialogArray, setDialogArray] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [currentDialog, setCurrentDialog] = useState("");
  const [currentResponses, setCurrentResponses] = useState([]);

  useEffect(() => {
    const handlePlayerNpcInteraction = (event) => {
      setIsPlayerInteractingNpc(event.detail);
      cameraControllerInstance.currentTarget = playerInstance
    };
    document.addEventListener("playerInteractNpc", handlePlayerNpcInteraction);

    return () => {
      document.removeEventListener(
        "playerInteractNpc",
        handlePlayerNpcInteraction
      );
    };
  }, [isPlayerInteractingNpc]);

  useEffect(() => {
    getNpcDialog()
      .then((data) => {
        const dialogString = data[0].dialog;
        const dialogWithoutBrackets = dialogString.slice(1, -1);
        const dialogArray = dialogWithoutBrackets
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((item) => item.trim());
        
        let dialogArr;
        if (data[0].is_array) {
          dialogArr = data[0].dialog.split("---")
          setCurrentDialog(dialogArr[0]);
        } else {
          setCurrentDialog(data[0].dialog);
          const responses = data.filter(
            (dialog) => dialog.response_to === data[0].id
          );
      
          setCurrentResponses(responses);
        }

        if (npcInstances.albyNPC.npcName === npc_name) {
          setCurrentTalkingNpc(npcInstances.albyNPC)
        }
        
        setDialogData(data);
        setDialogArray(dialogArr);
        setCurrentId(1);
        // setCurrentDialog(data[0].dialog);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, [npc_name]);

  const handleNextDialog = () => {
    try {
      const nextPage = dialogArray.indexOf(currentDialog) + 1;
      const dialogResponses = dialogData.filter(
        (dialog) => dialog.response_to === currentId
      );

      // console.log(dialogResponses)

      const test = dialogData.filter(
        (dialog) => dialog.id === currentId
      );
      if (test[0].stage === "end" && nextPage + 1 < dialogArray.length) {
        onClose();
        playerInstance.onNpcZone(null);
        setCurrentId(0);
      }
      
      if (nextPage + 1 < dialogArray.length) {
        setCurrentDialog(dialogArray[nextPage]);
        setCurrentResponses([]);
      } else {
        setCurrentDialog(dialogArray[nextPage]);
        const responses = dialogData.filter(
          (dialog) => dialog.response_to === currentId
        );
        setCurrentResponses(responses);
        switchCameraTarget();
        if (dialogArray[nextPage] === undefined) {
          onClose();
          playerInstance.onNpcZone(null);
        }
      }
    } catch (error) {
      onClose();
      console.log(error)
      playerInstance.onNpcZone(null);
    }
  };

  const switchCameraTarget = () => {
    if (currentId === 6) {
    cameraControllerInstance.currentTarget = currentTalkingNpc;

    const targetPosition = {
      x: playerInstance.getPosition().x + 2,
      y: playerInstance.getPosition().y + 5,
      z: playerInstance.getPosition().z + 2,
    };

    const animateCamera = (timestamp) => {
      const progress = (timestamp - startTime) / 5000; // 1000 ms = 1 second

      const newPosition = {
        x: lerp(cameraControllerInstance.getPosition().x, targetPosition.x, progress),
        y: lerp(cameraControllerInstance.getPosition().y, targetPosition.y, progress),
        z: lerp(cameraControllerInstance.getPosition().z, targetPosition.z, progress),
      };

      cameraControllerInstance.updateControllerPosition(newPosition.x, newPosition.y, newPosition.z);

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };

    const startTime = performance.now();

    // Start the animation
    requestAnimationFrame(animateCamera);
    } else {
      // cameraControllerInstance.setTrackPosition(playerInstance)
      cameraControllerInstance.currentTarget = playerInstance
    }
  }

  function lerp(start, end, progress) {
    return start + progress * (end - start);
  }

  const convertToArray = ({ dialog, id }) => {
    if (id !== currentId) {
      const result = dialog.split("---");
      setCurrentDialog(result[0])
      setDialogArray(result);
      setCurrentResponses([]);
    }
  }

  const getAllResponse = ({ id }) => {
    const nextDialogObj = dialogData.find(
      (dialog) => dialog.response_to === id
    );
    const responses = dialogData.filter(
      (dialog) => dialog.response_to === nextDialogObj.id
    );

    setCurrentResponses(responses);
    return nextDialogObj
  }

  const handleResponse = ({ id }) => {
    const nextDialogObj = getAllResponse({ id: id })
    if (nextDialogObj.is_array) {
      convertToArray({ dialog: nextDialogObj.dialog, id: id })
      // setCurrentId(id);
    } else {
      setCurrentDialog(nextDialogObj.dialog)
    }
    setCurrentId(nextDialogObj.id)
  }

  const DialogButton = ({ text, event }) => {
    return (
      <button className="npc-dialog-button" onClick={event}>
        {text === "Next" ? <FontAwesomeIcon icon={faChevronRight} size="lg" /> : text}
      </button>
    );
  };

  const getNpcDialog = async () => {
    try {
      const npc = await viewNpcData(npc_name);
      const dialog = await viewDialogById(npc[0].id);
      return dialog;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  return (
    <div className="npc-dialog-container">
      <p className="npc-dialog-name">{npc_name}</p>
      <p className="npc-dialog-text">{currentDialog}</p>
      {currentResponses.length > 0 ? (
        currentResponses.map((response, index) => (
          <DialogButton key={index} text={response.dialog} event={() => handleResponse(response)} />
        ))
      ) : (
        <DialogButton text={"Next"} event={handleNextDialog} />
      )}
    </div>
  );
};

export default DialogBox;
