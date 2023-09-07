import React, { useEffect, useState } from "react";
import {
  viewNpcIdByName,
  viewDialogById,
  viewNpcData,
} from "../../db/HandleTable";

const DialogBox = ({ npc_name }) => {
  const [dialogData, setDialogData] = useState([]);
  const [dialogArray, setDialogArray] = useState([]);
  const [currentId, setCurrentId] = useState(1);
  const [currentDialog, setCurrentDialog] = useState("");
  const [currentResponses, setCurrentResponses] = useState([]);

  useEffect(() => {
    getNpcDialog()
      .then((data) => {
        const dialogString = data[0].dialog;
        const dialogWithoutBrackets = dialogString.slice(1, -1);
        const dialogArray = dialogWithoutBrackets
          .split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)
          .map((item) => item.trim());

        setDialogData(data);
        setDialogArray(dialogArray);
        setCurrentId(1);
        setCurrentDialog(dialogArray[0]);
      })
      .catch((error) => {
        console.error("[ERROR]:", error);
      });
  }, [npc_name]);

  const handleNextDialog = () => {
    const nextPage = dialogArray.indexOf(currentDialog) + 1;
    if (nextPage < dialogArray.length) {
      setCurrentDialog(dialogArray[nextPage]);
      setCurrentResponses([]);
    } else {
      const nextDialogObjs = dialogData.filter(
        (dialog) => dialog.response_to === dialogData[1].id
      );
      setCurrentDialog(dialogData[1].dialog);
      setCurrentResponses(nextDialogObjs);
    }
  };

  const DialogButton = ({ text, event }) => {
    return (
      <button className="npc-dialog-button" onClick={event}>
        {text}
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
          <DialogButton key={index} text={response.dialog} />
        ))
      ) : (
        <DialogButton text={"Next"} event={handleNextDialog} />
      )}
    </div>
  );
};

export default DialogBox;
