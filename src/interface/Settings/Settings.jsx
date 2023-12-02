import React, { useState } from "react";
import CloseButtonModal from "../../components/CloseButtonModal";
import GraphicsSettings from "./GraphicsSettings";
import LogoutAlertModal from "../../components/LougoutAlertModal";

const Settings = ({
  onClose,
  antialias: { antialiasValue, setAntialiasValue },
  shadowMap: { shadowMapValue, setShadowMapValue },
}) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [isLogout, setIsLogout] = useState(false);

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
    <>
      {isLogout ? <LogoutAlertModal setIsLogout={setIsLogout} /> : null}
      <div className="settings-main-container">
        <div className="settings-navbar">
          <SideNavButton name="Graphics" onClickEvent={viewGraphicsSettings} />
          <SideNavButton name="Controls" onClickEvent={viewControlsSettings} />
          <SideNavButton name="Sounds" onClickEvent={viewSoundsSettings} />
          <SideNavButton name="Logout" onClickEvent={() => setIsLogout(true)} />
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
    </>
  );
};

export default Settings;
