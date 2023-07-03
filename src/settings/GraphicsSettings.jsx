import React, { useState } from "react";
import Checkbox from "../components/Checkbox";
import Dropdown from "../components/Dropdown";

const GraphicsSettings = ({
  antialias: { antialiasValue, setAntialiasValue },
  shadowMap: { shadowMapValue, setShadowMapValue },
}) => {
  const [tempAntialiasValue, setTempAntialiasValue] = useState(antialiasValue);
  const [tempShadowMapValue, setTempShadowMapValue] = useState(shadowMapValue);

  const SettingsItem = ({ item }) => {
    return <div className="graphics-settings-item">{item}</div>;
  };

  const saveSettings = (event) => {
    event.preventDefault();
    setAntialiasValue(tempAntialiasValue);
    // setShadowMapValue(tempShadowMapValue);
  };

  return (
    <div className="graphics-container">
      <div className="graphics-header">
        <h2>Graphics</h2>
      </div>
      <form onSubmit={saveSettings}>
        <div className="graphics-content-container">
          <div className="graphics-content-left">
            <SettingsItem item="Antialias" />
            <SettingsItem item="Shadow" />
          </div>
          <div className="graphics-content-right">
            <SettingsItem
              item={
                <Checkbox
                  value={tempAntialiasValue}
                  setValue={setTempAntialiasValue}
                />
              }
            />
            <SettingsItem item={<Dropdown />} />
          </div>
        </div>
        <div className="graphics-footer">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default GraphicsSettings;
