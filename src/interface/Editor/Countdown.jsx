import React, { useState, useEffect } from "react";

const Countdown = ({ initialTime, onCountdownEnd }) => {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    } else {
      onCountdownEnd(); // Callback when the countdown ends
    }
  }, [time, onCountdownEnd]);

  return <span>{time}</span>;
};

export default Countdown;
