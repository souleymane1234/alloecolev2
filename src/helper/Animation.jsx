import Aos from "aos";
import { useEffect } from "react";
import "aos/dist/aos.css";

const Animation = () => {
  useEffect(() => {
    Aos.init({
      offset: 0,
      easing: "ease",
      once: true,
      duration: 1200,
    });
  }, []);

  return null;
};

export default Animation;
