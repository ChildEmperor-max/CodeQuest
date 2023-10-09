import React from "react";
import gameBased from "src/assets/LandingPageAssets/gameBased.png";
import real from "src/assets/LandingPageAssets/real.png";
import textCoding from "src/assets/LandingPageAssets/textCoding.png";

function Category() {
  return (
    <section className="section category">
      <h2 className="section__title">Category</h2>
      <div className="category__container container grid">
        <div className="category__data">
          <img src={gameBased} alt="" className="category__img" />
          <h3 className="category__title">Game-Based Learning</h3>
          <p className="category__description">
            Immerse yourself in an exciting world of adventure and discovery as
            you learn Java programming through engaging quests. CodeQuest
            transforms learning into an epic gaming experience, making it
            enjoyable and educational.
          </p>
        </div>
        <div className="category__data">
          <img src={textCoding} alt="" className="category__img" />
          <h3 className="category__title">Text-Based Coding</h3>
          <p className="category__description">
            <br />
            Master the art of coding with ease using our intuitive text-based
            coding interface. Write, test, and debug Java code directly within
            the platform, all while enjoying a user-friendly environment
            designed to enhance your programming skills.
          </p>
        </div>
        <div className="category__data">
          <img src={real} alt="" className="category__img" />
          <h3 className="category__title">Real-World Problem Solving</h3>
          <p className="category__description">
            Explore a world where coding isn't just theoretical – it's practical
            and hands-on. Tackle real-world problems by writing Java code to
            solve challenges, empowering you to apply your programming knowledge
            in meaningful ways.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Category;
