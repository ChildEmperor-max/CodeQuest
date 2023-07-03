import React, { useState } from "react";

const Dropdown = () => {
  const [selectedOption, setSelectedOption] = useState("false");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="false">Off</option>
        <option value="BasicShadowMap">Low</option>
        <option value="PCFShadowMap">Medium</option>
        <option value="PCFSoftShadowMap">High</option>
        <option value="VSMShadowMap">Highest</option>
      </select>
    </>
  );
};

export default Dropdown;
