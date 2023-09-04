import * as THREE from "three";

export default class Loader {
  constructor(text) {
    this.loadingManager = new THREE.LoadingManager();

    this.loadingGameScreenDiv = document.getElementById("loading-game-screen");
    this.loadingGameScreenText = document.getElementById(
      "loading-game-screen-text"
    );

    // Set up the loading manager callbacks
    this.loadingManager.onStart = () => {
      this.loadingGameScreenDiv.style.display = "block";
      this.loadingGameScreenText.textContent = text;
    };

    this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      const formattedProgress = progress.toFixed(0);
      this.loadingGameScreenText.textContent = `${text} ... ${formattedProgress}%`;
    };

    this.loadingManager.onLoad = () => {
      this.loadingGameScreenText.textContent = "";
      this.loadingGameScreenDiv.style.display = "none";
    };
  }

  // Add other methods for handling different types of assets loading, etc.
}
