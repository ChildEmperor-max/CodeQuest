import React from "react";
import codeEditor from "src/assets/LandingPageAssets/codeEditor.png";
import world from "src/assets/LandingPageAssets/world.png";
import progress from "src/assets/LandingPageAssets/progress.png";
import quest from "src/assets/LandingPageAssets/quest.png";
import learn from "src/assets/LandingPageAssets/learn.png";
import roles from "src/assets/LandingPageAssets/roles.png";

function Features() {
  return (
    <section className="section feature" id="feature">
      <h2 className="section__title">Features</h2>
      <div className="feature__container container grid">
        <div className="feature__content">
          <img src={world} alt="" className="feature__img" />
          <h3 className="feature__title">Immersive World</h3>
          <span className="feature__subtitle">
            Explore a visually stunning 3D environment filled with NPCs,
            buildings, and a magical village.
          </span>
        </div>
        <div className="feature__content">
          <img src={quest} alt="" className="feature__img" />
          <h3 className="feature__title">Engaging Quests</h3>
          <span className="feature__subtitle">
            Embark on exciting coding quests and challenges to enhance your
            programming skills.
          </span>
        </div>
        <div className="feature__content">
          <img src={learn} alt="" className="feature__img" />
          <h3 className="feature__title">Learn by Doing</h3>
          <span className="feature__subtitle">
            Dive into practical, hands-on coding challenges that reinforce
            programming concepts and problem-solving skills.
          </span>
        </div>
        <div className="feature__content">
          <img src={codeEditor} alt="" className="feature__img" />
          <h3 className="feature__title">Code Editor</h3>
          <span className="feature__subtitle">
            Write, test, and submit Java code within the game, making learning
            hands-on and fun.
          </span>
        </div>
        <div className="feature__content">
          <img src={progress} alt="" className="feature__img" />
          <h3 className="feature__title">Progress Tracking</h3>
          <span className="feature__subtitle">
            Track your coding progress, earn rewards, and see your skills
            improve over time with leaderboards and achievements.
          </span>
        </div>
        <div className="feature__content">
          <img src={roles} alt="" className="feature__img" />
          <h3 className="feature__title">Role-Based</h3>
          <span className="feature__subtitle">
            Whether you're a student, self-learner, code enthusiast, or
            educator, CodeQuest offers tailored experiences for all.
          </span>
        </div>
      </div>
    </section>
  );
}

export default Features;
