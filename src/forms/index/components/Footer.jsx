import React from "react";

function Footer() {
  const footerStyle = {
    fontSize: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
  };
  return (
    <section className="Footer container" id="Footer" style={footerStyle}>
      <p>&copy; {new Date().getFullYear()} CodeQuest</p>
    </section>
  );
}

export default Footer;
