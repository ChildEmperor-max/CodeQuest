import React, { useState } from "react";
import axios from "axios";

const EditAvatarModal = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    } else {
      console.log("Please select a valid image file.");
    }
  };

  const handleSubmit = (event) => {
    const playerId = localStorage.getItem("playerId");
    event.preventDefault();

    if (!selectedFile) {
      console.log("Please select a file.");
      return;
    }

    const data = new FormData();
    data.append("file", selectedFile);

    axios
      .post("http://127.0.0.1:8000/profile/uploadImage/" + playerId, data)
      .then((res) => {
        console.log(res.data);
        onClose();
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <div className="edit-profile-avatar-container">
      <div className="edit-profile-avatar-header">Change Avatar</div>
      <form onSubmit={handleSubmit}>
        <div className="edit-profile-avatar-content">
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              style={{ maxWidth: "40%", marginTop: "10px" }}
            />
          )}
        </div>
        <div className="edit-profile-modal-button-container">
          <button onClick={onClose}>Cancel</button>
          {previewImage ? <button type="submit">Save</button> : null}
        </div>
      </form>
    </div>
  );
};

export default EditAvatarModal;
