import React from "react";
import aboutImage from "src/assets/LandingPageAssets/about.png";

function About() {
  const soundwaveStyles = [12, 31, 25, 18, 11, 23, 16, 34, 19, 14].map((i) => ({
    "--i": i,
  }));
  return (
    <section className="section about" id="about">
      <div className="about__container container grid">
        <div className="about__data">
          <h2 className="section__title about__title">
            About CodeQuest
            <br />
          </h2>
          <p className="about__description">
            CodeQuest is a web-based platform that combines the excitement of
            gaming with immersive Java programming learning. Designed for
            students, coding enthusiasts, and educators, it offers a 3D
            adventure where players complete quests, solve coding challenges,
            and write Java code guided by Alby, as companion. With a range of
            quests from basic to advanced Java concepts, an interactive code
            editor, and a rewarding system, CodeQuest makes learning Java
            engaging and fun.
          </p>
          <a href="#" className="play--now">
            <div className="box">
              <button className="play__now">PLAY NOW!</button>
              <div className="music">
                {soundwaveStyles.map((style, index) => (
                  <span className="soundwave" style={style} key={index}></span>
                ))}
              </div>
            </div>
          </a>
        </div>
        <img src={aboutImage} alt="" className="about__img" />
      </div>
    </section>
  );
}

export default About;
