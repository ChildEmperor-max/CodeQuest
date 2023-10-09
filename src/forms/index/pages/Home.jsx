import React from "react";
import { BiRightArrowAlt } from "react-icons/bi";
import homeImage from "src/assets/LandingPageAssets/knock-code.png";

function Home() {
  const soundwaveStyles = [12, 31, 25, 18, 11, 23, 16, 34, 19, 14].map((i) => ({
    "--i": i,
  }));
  return (
    <section className="Home container" id="Home">
      {/* ... (Home content) */}
      <div className="home__content grid">
        <div className="home__group">
          <div className="home__img">
            <br />
            <br />
            <br />
            <br />
            <img src={homeImage} alt="" className="home__img" />
          </div>
          <div className="home__indicator"></div>
          <div className="home__details-img">
            <h4 className="home__details-title">Where Java Programming</h4>
            <span className="home__details-subtitle">
              Meets Playful Learning
            </span>
          </div>
        </div>
        <div className="home__data">
          {/* <h3 className="home__subtitle"># Welcome CodeQuesters</h3> */}
          <h1 className="home__title">
            <div className="content">
              <div className="content__container">
                <ul className="content__container__list">
                  <li className="content__container__list__item">GAMING </li>
                  <li className="content__container__list__item">LEARNING </li>
                  <li className="content__container__list__item">CODING </li>
                  <li className="content__container__list__item">EXPLORE </li>
                </ul>
              </div>
            </div>
            CODEQUEST <br /> DOES IT ALL{" "}
          </h1>
          <p className="home__description">
            Embark on an exciting journey into the world of Java programming
            like never before. CodeQuest is your gateway to immersive learning
            through adventure. Whether you're a novice coder or a seasoned
            developer, there's an adventure waiting for you.
          </p>
          <div className="home__buttons">
            <a href="#./pages/Login" className="play--now">
              <div className="box">
                <a href="/login">
                  <button className="play__now">PLAY NOW!</button>
                </a>
                <div className="music">
                  {soundwaveStyles.map((style, index) => (
                    <span
                      className="soundwave"
                      style={style}
                      key={index}
                    ></span>
                  ))}
                </div>
              </div>
            </a>
            <a href="#faqs" className="button--link button--flex">
              FAQs <BiRightArrowAlt className="button__icon" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
