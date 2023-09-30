import * as THREE from "three";

export default class ManageLoader {
  constructor(object, divElement, textElement) {
    this.loadingManager = new THREE.LoadingManager();
    this.loadingState = {
      started: "started",
      onProgress: "onPrgress",
      finished: "finished",
    };
    this.object = object;

    this.loadingGameScreenDiv = divElement;
    this.loadingGameScreenText = textElement;

    // Set up the loading manager callbacks
    this.loadingManager.onStart = () => {
      this.loadingGameScreenDiv.style.display = "block";
      this.loadingGameScreenText.textContent = object;
      const event = new CustomEvent("loadingStarted", {
        detail: 0,
      });
      document.dispatchEvent(event);
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      const formattedProgress = progress.toFixed(0);
      this.loadingGameScreenText.textContent = `${object} ${formattedProgress}%`;
      const event = new CustomEvent("gameAssetLoader", {
        detail: formattedProgress,
      });
      document.dispatchEvent(event);
    };

    this.loadingManager.onLoad = () => {
      this.loadingGameScreenText.textContent = "";
      this.loadingGameScreenDiv.style.display = "none";
      const event = new CustomEvent("loadingFinished", {
        detail: 100,
      });
      document.dispatchEvent(event);
    };
  }

  // Add other methods for handling different types of assets loading, etc.
}
