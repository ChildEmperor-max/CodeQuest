import React from "react";
import CloseButtonModal from "../../components/CloseButtonModal";

const PseudoCode = ({ code, onClose }) => {
  return (
    <div className="pseudo-code-container">
      <CloseButtonModal onClose={onClose} />
      <code>{code}</code>
    </div>
  );
};

export default PseudoCode;
