import { useState, useEffect } from "react";

const usePopupWithTimeout = (
  onCloseCallback,
  initialTimeout = 5000,
  closeAnimationTimeout = 1000
) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    const timer = setTimeout(() => {
      onCloseCallback();
    }, closeAnimationTimeout);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, initialTimeout);

    return () => clearTimeout(timer);
  }, [initialTimeout]);

  return {
    isOpen,
    handleClose,
  };
};

export default usePopupWithTimeout;
