import React, { useState, useEffect } from "react";

const TypingAnimation = ({ text, delay, onFinishedTyping, skipAnimation }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  // Add an effect to reset currentText when text changes
  useEffect(() => {
    setCurrentText("");
    setCurrentIndex(0);
  }, [text]);

  const handleSkipAnimation = () => {
    setCurrentText(text);
    setCurrentIndex(text.length);
  };

  useEffect(() => {
    let timeout;
    if (text !== undefined) {
      if (currentIndex < text.length && !skipAnimation) {
        setIsTyping(true);
        onFinishedTyping(false);
        timeout = setTimeout(() => {
          setCurrentText((prevText) => prevText + text[currentIndex]);
          setCurrentIndex((prevIndex) => prevIndex + 1);
        }, delay);

        return () => clearTimeout(timeout);
      } else {
        if (isTyping) {
          setIsTyping(false);
          onFinishedTyping(true);
          if (skipAnimation) {
            handleSkipAnimation();
          }
        }
      }
    }
  }, [currentIndex, delay, text, isTyping, setIsTyping, skipAnimation]);

  return <span>{currentText}</span>;
};

export default TypingAnimation;
