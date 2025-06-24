import { motion } from "framer-motion";

const levels = [
  { level: 1, experience: 0 },
  { level: 2, experience: 100 },
  { level: 3, experience: 300 },
  { level: 4, experience: 600 },
  { level: 5, experience: 1000 },
  { level: 6, experience: 1500 },
  { level: 7, experience: 2100 },
  { level: 8, experience: 2800 },
  { level: 9, experience: 3600 },
  { level: 10, experience: 4500 },
];

export const ExperienceBar = ({ user, shouldAnimate }) => {
  const userExperience = Math.max(0, user?.experience);
  const currentlevel = levels
  .slice()
  .reverse()
  .find(level => userExperience >= level.experience) || levels[0];
  const nextLevel = levels.find(level => level.level === currentlevel.level + 1);

  const progress = nextLevel
    ? ((userExperience - currentlevel.experience) / (nextLevel.experience - currentlevel.experience)) * 100
    : 100;

  return (
    <div className="relative mt-5 ml-5 min-w-30 w-64">
      {/* Subtle pulsing background glow */}
      {shouldAnimate ? (
        <motion.div
          className="absolute top-0 left-0 h-4 w-full rounded-full"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ backgroundColor: "#93c5fd", filter: "blur(10px)" }}
        />
      ) : (
        <div
          className="absolute top-0 left-0 h-4 w-full rounded-full"
          style={{ backgroundColor: "#93c5fd", filter: "blur(10px)", opacity: 0.4 }}
        />
      )}

      {/* Progress Bar */}
      <div className="bg-gray-300 rounded-full h-4 overflow-hidden relative z-10">
        {shouldAnimate ? (
          <motion.div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ position: "relative" }}
          >
            {/* Glossy reflection */}
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-full" />
          </motion.div>
        ) : (
          <div
            className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-700"
            style={{ width: `${progress}%`, position: "relative" }}
          >
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-full" />
          </div>
        )}
      </div>

      {/* Level Labels */}
      <div className="flex justify-between text-sm mt-1">
        <span>{currentlevel ? currentlevel.level : 1}</span>
        <span>{nextLevel ? nextLevel.level : 11}</span>
      </div>
    </div>
  );
};
