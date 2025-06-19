import { motion } from 'framer-motion';

export const ProgressBar = ({ percentage }) => {
  return (
    <motion.div
      className="bg-blue-600 h-2.5 rounded-full"
      key={percentage} // Forces Framer Motion to see this as a new element when percentage changes
      initial={{ width: 0 }}
      animate={{ width: `${percentage}%` }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    />
  );
};

export default ProgressBar;