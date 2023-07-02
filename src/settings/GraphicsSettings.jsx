import React, { useEffect } from "react";
import Checkbox from "../components/Checkbox";

const GraphicsSettings = ({
  antialias: { antialiasValue, setAntialiasValue },
  shadowMap: { shadowMapValue, setShadowMapValue },
}) => {
  const SettingsItem = ({ item }) => {
    return <div className="graphics-settings-item">{item}</div>;
  };

  return (
    <div className="graphics-container">
      <div className="graphics-header">
        <h2>Graphics</h2>
      </div>
      <div className="graphics-content-container">
        <div className="graphics-content-left">
          <SettingsItem item="Antialias" />
          <SettingsItem item="Shadow" />
          <SettingsItem item="Test" />
        </div>
        <div className="graphics-content-right">
          <SettingsItem item={<Checkbox />} />
          <SettingsItem item="test" />
          <SettingsItem item="test" />
        </div>
      </div>
    </div>
  );
};

export default GraphicsSettings;
