import React, { useEffect, useState } from "react";

const RealTimeWidthView = () => {
  const [isViewWidth, setViewWidth] = useState(0);

  useEffect(() => {
    const handleResize = async () => setViewWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isViewWidth };
};

export default RealTimeWidthView;
