import React from "react";
import FAQs from "src/assets/LandingPageAssets/FAQs.png";
function Faqs() {
  return (
    <section className="section faqs" id="faqs">
      <div className="faqs__container container grid">
        <div className="faqs__data">
          {/* <h1 className="faqs__title">FAQs </h1> */}
          <div className="items">
            <details>
              <summary>Q: What is CodeQuest?</summary>
              <p className="faqs__description">
                CodeQuest is an immersive web-based learning platform that
                combines the excitement of gaming with the fundamentals of Java
                programming. It offers an engaging way to learn and practice
                coding skills through quests, challenges, and interactive
                adventures.
              </p>
            </details>
            <details>
              <summary>Q: Who is CodeQuest designed for?</summary>
              <p className="faqs__description">
                CodeQuest is designed for learners of all levels, from beginners
                looking to start their coding journey to experienced programmers
                seeking to enhance their Java skills. It caters to students,
                educators, and coding enthusiasts alike.
              </p>
            </details>
            <details>
              <summary>Q: How does CodeQuest work?</summary>
              <p className="faqs__description">
                CodeQuest presents coding challenges in a game-like environment.
                Users complete quests, interact with NPCs, and write Java code
                to solve in-game problems. The platform provides instant
                feedback, tracks progress, and rewards users for their
                achievements.
              </p>
            </details>
            <details>
              <summary>
                Q: What do I need to get started with CodeQuest?
              </summary>
              <p className="faqs__description">
                To begin your CodeQuest adventure, all you need is a computer
                with internet access and a modern web browser. Simply register,
                log in, and embark on your coding journey.
              </p>
            </details>
            <details>
              <summary>Q: Is CodeQuest free to use?</summary>
              <p className="faqs__description">
                Yes, CodeQuest offers a free-to-use version, allowing users to
                access a wide range of coding challenges and quests.
              </p>
            </details>
            <details>
              <summary>Q: How can I track my progress in CodeQuest?</summary>
              <p className="faqs__description">
                Your progress in CodeQuest is tracked through the platform's
                user profile. You can view completed quests, earned rewards, and
                monitor your coding skills' improvement over time.
              </p>
            </details>
            <details>
              <summary>
                Q: What programming language is taught on CodeQuest?
              </summary>
              <p className="faqs__description">
                CodeQuest primarily focuses on teaching and reinforcing Java
                programming concepts and syntax. It's an ideal platform for
                those interested in Java coding.
              </p>
            </details>
            <details>
              <summary>
                Q: Can I play CodeQuest on a mobile device or tablet?
              </summary>
              <p className="faqs__description">
                While CodeQuest is primarily designed for desktop or laptop
                computers, you may be able to access it on some tablets with
                larger screens and modern web browsers. However, for the best
                experience, we recommend using a computer.
              </p>
            </details>
          </div>
        </div>
        <img src={FAQs} alt="" className="faqs__img" />
      </div>
    </section>
  );
}

export default Faqs;
