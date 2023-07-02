import React, { useState } from "react";

const Checkbox = () => {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return <input type="checkbox" checked={checked} onChange={handleChange} />;
};

export default Checkbox;
