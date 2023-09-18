import React, { useEffect } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";

const QuestHint = ({ questHint, onClose }) => {
  useEffect(() => {
    console.log(questHint);
  }, []);

  // Split the questHint into lines
  const questHintLines = questHint.split("\n");

  return (
    <div className="alby-interface centered">
      <CloseButtonModal onClose={onClose} />
      <div className="alby-interface-content">
        <div className="code-snippet">
          <code>
            <div className="code-snippet">
              {questHintLines.map((line, index) => (
                <div className="line" key={index}>
                  {line}
                </div>
              ))}
            </div>
          </code>
        </div>
      </div>
    </div>
  );
};

export default QuestHint;
