import React, { useState } from "react";

const Checkbox = ({ value, setValue }) => {
  const [checked, setChecked] = useState(value);

  const handleChange = (event) => {
    setValue(event.target.checked);
    setChecked(event.target.checked);
  };

  return <input type="checkbox" checked={checked} onChange={handleChange} />;
};

export default Checkbox;
