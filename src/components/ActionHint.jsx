import React, { useEffect, useRef } from "react";
import { useEffectOnce } from "./UseEffectOnce";
import * as THREE from "three";

export const ActionHint = ({ scene, text, position, yOffset, camera }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const initialize = () => {
      const text2 = document.createElement("div");
      text2.classList.add("interact-popup-text");
      text2.innerHTML = text;

      const coords = toXYCoords(position);
      text2.style.top = coords.y + "px";
      text2.style.left = coords.x + "px";
      hideText();
      document.body.appendChild(text2);

      textRef.current = text2;
    };

    const updatePosition = (pos) => {
      const coords = toXYCoords(pos);
      textRef.current.style.top = coords.y + "px";
      textRef.current.style.left = coords.x + "px";
    };

    const setPosition = (pos) => {
      position = pos;
    };

    const showText = (pos) => {
      textRef.current.style.display = "block";
      updatePosition(pos);
    };

    const hideText = () => {
      textRef.current.style.display = "none";
    };

    const toXYCoords = (pos) => {
      const vector = pos.clone();
      vector.project(camera);
      vector.x = ((vector.x + 1) / 2) * window.innerWidth - 20;
      vector.y = (-(vector.y - 1) / 2) * window.innerHeight - yOffset;
      return vector;
    };

    initialize();

    return () => {
      if (textRef.current) {
        document.body.removeChild(textRef.current);
      }
    };
  }, [scene, text, position, yOffset, camera]);

  return null;
};

export default ActionHint;
