import { useState } from "react";
import { Header } from "./Header";
import { CheckList } from './Calendar';
import entries from "../services/entries";
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from "react-toastify";
import {motion} from 'framer-motion'
export const AddHabit = ({ user, setUser, readyHabits }) => {
   const { habitText } = useParams();
  const decodedHabitText = decodeURIComponent(habitText);
  const habit = readyHabits.find(h => h.text === decodedHabitText);
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const navigate = useNavigate();
  const handleSubmit = async () => {
    try {
      if (!user || !user.token || !user.id) {
        console.error("User not loaded or invalid:", user);
        toast("User not authenticated");
        return;
      }
      
        entries.setToken(user.token);
      await entries.createEntry({
        doneBy: user.id,
        title: habit.text,
        weekdays: selectedWeekdays,
        emoji: habit.emoji, 
      });
      toast("Entry added successfully!");
      setSelectedWeekdays([])
      navigate("/dashboard")
    } catch (error) {
      console.error("Failed to add entry:", error);
      toast("Failed to add entry");
    }
  };

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <div className="w-11/15 min-h-150 mx-auto text-center mt-10 bg-[#A14DA0] rounded-xl pt-10">
        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-10 drop-shadow-xl'>{habit.emoji ? habit.emoji : "✨"} {habit.text}</h2>
        <CheckList selectedWeekdays={selectedWeekdays} setSelectedWeekdays={setSelectedWeekdays} />
        <h2 className='text-2xl sm:text-2xl lg:text-2xl mb-10 drop-shadow-xl'>Add this habit to your habits?</h2>
        <motion.button 
          onClick={handleSubmit}
          className="normal-case font-bold text-lg btn btn-ghost tracking-tight mb-5 bg-green-600 text-white hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md"
        >
          Add to my habits
        </motion.button>
      </div>
    </div>
  );
};
