import React from "react";
// import logo from "../assets/logo.png";

function Header() {
  return (
    <header className="header" id="header">
      <nav className="nav container">
        <a href="#" className="nav__logo">
          {/* <img src={logo} alt="" className=".nav__logo-img" /> */} CodeQuest{" "}
        </a>
        <div className="nav__menu" id="nav-menu">
          <ul className="nav__list">
            <li className="nav__item">
              <a href="#Home" className="nav__link active-link">
                <span className="code">&lt;</span>Home
                <span className="code">&#47;&gt;</span>
              </a>
            </li>
            <li className="nav__item">
              <a href="#about" className="nav__link">
                <span className="code">&lt;</span>About
                <span className="code">&#47;&gt;</span>
              </a>
            </li>
            <li className="nav__item">
              <a href="#feature" className="nav__link">
                <span className="code">&lt;</span>Features
                <span className="code">&#47;&gt;</span>
              </a>
            </li>
            <li className="nav__item">
              <a href="#new" className="nav__link">
                <span className="code">&lt;</span>Support
                <span className="code">&#47;&gt;</span>
              </a>
            </li>
            <a href="/signup" className="button button--ghost">
              Get Started
            </a>
          </ul>
          <div className="nav__close" id="nav-close">
            <i className="bx bx-x"></i>
          </div>
        </div>
        <div className="nav__toggle" id="nav-toggle">
          <i className="bx bx-grid-alt"></i>
        </div>
      </nav>
    </header>
  );
}

export default Header;
