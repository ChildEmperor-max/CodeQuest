import React, { useEffect, useState } from "react";
import { fetchHelpByDialogId } from "../../db/HandleTable";
import CloseButtonModal from "../../components/CloseButtonModal";

const QuestHint = ({ questHintId, nextHint, onClose }) => {
  const [questHintLines, setQuestHintLines] = useState(null);
  // const questHintLines = questHint.split("\n");

  useEffect(() => {
    getQuestHint()
      .then((result) => {
        const helpData = result[0];
        const lines = helpData.template.split("\n");
        setQuestHintLines(lines);
        if (nextHint - 1 > lines.length) {
          onClose();
        }
      })
      .catch((error) => {
        console.log("[ERROR VIEWING QUEST HINT]: ", error);
      });
  }, [nextHint]);

  const getQuestHint = async () => {
    try {
      const data = await fetchHelpByDialogId(questHintId);
      return data;
    } catch (error) {
      console.error("[ERROR]:", error);
      throw error;
    }
  };

  return (
    <div className="alby-interface centered">
      <CloseButtonModal onClose={onClose} />
      <div className="alby-interface-content">
        <div className="code-snippet">
          <code>
            {questHintLines &&
              questHintLines.map((line, index) => (
                <div
                  className={`line ${
                    index === nextHint - 1 ? "highlight" : ""
                  }`}
                  key={index}
                >
                  {line}
                </div>
              ))}
          </code>
        </div>
      </div>
    </div>
  );
};

export default QuestHint;
