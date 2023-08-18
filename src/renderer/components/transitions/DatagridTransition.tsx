import { motion, Variants } from 'framer-motion';
import React, { ReactNode, useEffect } from 'react';

const animationConfiguration: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

interface DatagridTransitionProps {
  children: ReactNode;
  duration?: number;
}

const DatagridTransition: React.FC<DatagridTransitionProps> = ({
  children,
  duration = 2,
}) => {
  useEffect(() => {
    // Hide scrollbar during the animation
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore scrollbar after the animation is complete
      document.body.style.overflow = 'auto';
    };
  }, []);
  const pageVariants = {
    initial: {
      opacity: 0,
      y: '100%',
    },
    enter: {
      opacity: 1,
      y: '0%',
      transition: {
        duration: 0.5,
        ease: [0.2, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: '-100%',
      transition: {
        duration: 0.5,
        ease: [0.2, 0, 0.2, 1],
      },
    },
  };

  return (
    <motion.div
      style={{ height: '100%' }}
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

export default DatagridTransition;
