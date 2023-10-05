import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CloseButtonModal from "../../components/CloseButtonModal";
import GraphicsSettings from "./GraphicsSettings";

const Settings = ({
  onClose,
  antialias: { antialiasValue, setAntialiasValue },
  shadowMap: { shadowMapValue, setShadowMapValue },
}) => {
  const [currentTab, setCurrentTab] = useState(1);

  const viewGraphicsSettings = () => {
    setCurrentTab(1);
  };

  const viewControlsSettings = () => {
    setCurrentTab(2);
  };

  const viewSoundsSettings = () => {
    setCurrentTab(3);
  };

  const SideNavButton = ({ name, onClickEvent = null }) => {
    return (
      <button className="side-nav-buttons" onClick={onClickEvent}>
        {name}
      </button>
    );
  };

  return (
    <div className="settings-main-container">
      <div className="settings-navbar">
        <SideNavButton name="Graphics" onClickEvent={viewGraphicsSettings} />
        <SideNavButton name="Controls" onClickEvent={viewControlsSettings} />
        <SideNavButton name="Sounds" onClickEvent={viewSoundsSettings} />
        <a href="/login">
          <SideNavButton name="Logout" />
        </a>
      </div>
      <div className="settings-content-container">
        <CloseButtonModal onClose={onClose} />
        {currentTab === 1 ? (
          <GraphicsSettings
            antialias={{ antialiasValue, setAntialiasValue }}
            shadowMap={{ shadowMapValue, setShadowMapValue }}
          />
        ) : null}
        {currentTab === 2 ? <p>Controls </p> : null}
        {currentTab === 3 ? <p>Sounds </p> : null}
      </div>
    </div>
  );
};

export default Settings;
