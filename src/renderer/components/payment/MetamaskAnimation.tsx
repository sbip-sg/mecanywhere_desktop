import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import foxAnimation from './fox-in.json';

const MetamaskAnimation = ({ useGrayscale, isReversed }) => {
  const animationContainer = useRef(null);
  const containerStyle = {
    width: '150px',
    height: '150px',
    filter: useGrayscale ? 'grayscale(100%)' : '',
  };

  useEffect(() => {
    if (animationContainer.current) {
      const anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        animationData: foxAnimation,
      });
      anim.setDirection(isReversed ? -1 : 1);
      return () => anim.destroy();
    }
  }, [isReversed]);

  return <div ref={animationContainer} style={containerStyle} />;
};

export default MetamaskAnimation;
