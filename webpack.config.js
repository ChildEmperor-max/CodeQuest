const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/world/LoadWorld.js", // Adjust the path to your main JavaScript file
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.(glb|gltf)$/,
        use: "file-loader",
      },
    ],
  },
};
