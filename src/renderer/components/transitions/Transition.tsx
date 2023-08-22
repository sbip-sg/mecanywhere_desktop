import { motion, Variants } from 'framer-motion';
import React, { ReactNode } from 'react';

const animationConfiguration: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

interface TransitionsProps {
  children: ReactNode;
  duration?: number;
}

const Transitions: React.FC<TransitionsProps> = ({
  children,
  duration = 0.4,
}) => {
  return (
    <motion.div
      id="motiondiv"
      style={{ height: '100%' }}
      variants={animationConfiguration}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};

export default Transitions;