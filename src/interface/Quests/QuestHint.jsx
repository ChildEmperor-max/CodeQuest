import React, { useEffect, useState } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";

const QuestHint = ({ questHint, nextHint, onClose }) => {
  const questHintLines = questHint.split("\n");

  useEffect(() => {
    if (nextHint - 1 > questHintLines.length) {
      onClose();
    }
  }, [nextHint]);

  return (
    <div className="alby-interface centered">
      <CloseButtonModal onClose={onClose} />
      <div className="alby-interface-content">
        <div className="code-snippet">
          <code>
            <div className="code-snippet">
              {questHintLines.map((line, index) => (
                <div
                  className={`line ${
                    index === nextHint - 1 ? "highlight" : ""
                  }`}
                  key={index}
                >
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
