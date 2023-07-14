import React, { useState } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import {
  TiArrowUp,
  TiArrowRight,
  TiArrowDown,
  TiArrowLeft,
} from "react-icons/ti";

const ControlsHelper = ({ onClose }) => {
  const [page, setPage] = useState(1);

  const nextPage = () => {
    setPage(page + 1);
  };

  const prevPage = () => {
    setPage(page - 1);
  };

  const NextOrPreviousButton = ({ next }) => {
    return (
      <>
        {next ? (
          <button onClick={nextPage}>Next</button>
        ) : (
          <button onClick={prevPage}>Back</button>
        )}
      </>
    );
  };

  return (
    <>
      {page === 1 ? (
        <div className="helper-main-container">
          <div className="helper-box-container centered">
            <div className="helper-close-button">
              <CloseButtonModal onClose={onClose} />
            </div>
            <img
              src="src/assets/help/controls-helper-1.png"
              className="helper-box centered"
            />
            <p>Movement Controls</p>
            <p>
              The controls to move are W to move forward
              <TiArrowUp size={25} />, S to move backward
              <TiArrowDown size={25} />, A to move to the left
              <TiArrowLeft size={25} />, and D to move to the right
              <TiArrowRight size={25} />.
            </p>
            <NextOrPreviousButton next={true} />
          </div>
        </div>
      ) : null}
      {page === 2 ? (
        <div className="helper-main-container">
          <div className="helper-box-container centered">
            <div className="helper-close-button">
              <CloseButtonModal onClose={onClose} />
            </div>
            <div className="helper-box centered"></div>
            <p>Test2</p>
            <p>This is a test2</p>
            <NextOrPreviousButton next={false} />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ControlsHelper;
