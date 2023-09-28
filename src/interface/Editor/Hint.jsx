import React from "react";
import CloseButtonModal from "../../components/CloseButtonModal";

const Hint = ({ hint, onClose }) => {
  return (
    <div className="hint-code-container">
      <CloseButtonModal onClose={onClose} />
      <code>{hint}</code>
    </div>
  );
};

export default Hint;
