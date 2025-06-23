import { Header } from "./Header";
import { motion } from 'framer-motion'
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const AllHabits = ({ user, setUser }) => {
  if (!user || !user.entries) return null;
    console.log(user.entries.map(habit => habit.weekdays))
  return (
    <div>
      <Header user={user} setUser={setUser} />
      <h2 className='text-3xl sm:text-4xl lg:text-5xl mb-5 mt-5 text-center pb-10 text-[#7E1F86] font-extrabold '>Habit Calendar</h2>

      <div className="grid grid-cols-2 min-h-150 sm:grid-cols-4 lg:grid-cols-7 gap-4 mx-5">
        {weekdays.map((day) => (
          <div key={day} className="bg-[#A14DA0] rounded-xl p-4 hover:drop-shadow-md text-white min-h-48">
            <h3 className="text-xl font-bold mb-4 text-center">{day}</h3>
            {user.entries
              .filter(habit => habit.weekdays?.includes(day))
              .map((habit, index) => (
                <motion.div
                    key={index}
                    className="bg-white text-black text-center rounded-lg shadow p-2 mb-3 hover:scale-95 transition duration-150"
                    initial={{ y: 20, filter: "blur(8px)", opacity: 0 }}
                    animate={{ y: 0, filter: "blur(0px)", opacity: 1 }}
                    transition={{
                      duration: 0.1,
                      ease: [0.42, 0.5, 0.5, 0],
                      delay: index * 0.05,
                    }}
                  >
                  <div className="text-2xl">{habit.emoji}</div>
                  <div className="text-sm font-semibold">{habit.title}</div>
                </motion.div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};
