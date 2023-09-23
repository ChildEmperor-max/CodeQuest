import React from "react";

const CustomColorText = ({ text }) => {
  const CustomLessThan = () => (
    <span className="angle-bracket-color">&lt;</span>
  );
  const CustomGreaterThan = () => (
    <span className="angle-bracket-color">&gt;</span>
  );

  return (
    <div>
      {text.split("<").map((part, index) => (
        <React.Fragment key={index}>
          {index > 0 && <CustomLessThan />}
          {part.split(">").map((subPart, subIndex) => (
            <React.Fragment key={subIndex}>
              {subIndex > 0 && <CustomGreaterThan />}
              {subPart}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CustomColorText;
