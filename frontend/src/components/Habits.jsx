import { useState, useEffect } from "react";
import habitservice from '../services/habits'
import { Header } from '../components/Header'
import {
  Link
} from 'react-router-dom'

export default function HabitComponent({ userId, user, setUser, setMessage, readyHabits, setReadyHabits }) {
  const [selected, setSelected] = useState("")
  useEffect(() => {
    if (readyHabits.length > 0 && selected === "") {
      setSelected(encodeURIComponent(readyHabits[0].text));
    }
  }, [readyHabits, selected]);
  // Add new habit handler
  const handlePrompt = async () => {
    const text = window.prompt("Enter your custom habit:");
    if (!text || text.trim() === "") return;

    const trimmed = text.trim();
    if(readyHabits.find(e => e.text === trimmed)){
      alert("You can't have the same habit twice!")
      return;
    }
    try {
      const createdHabit = await habitservice.createHabit({ userId, text: trimmed, emoji: "✨" });
      if (createdHabit && createdHabit.text) {
        setReadyHabits((prev) => [...prev, createdHabit]);
        setMessage && setMessage("Habit added!");
      } else {
        alert("Failed to add habit");
      }
    } catch (error) {
      console.error("Error adding habit:", error);
      alert("Failed to add habit");
    }
  };

  const handleSelected = (habitText) => {
    setSelected(encodeURIComponent(habitText));
  };
  return (
    <div>
      <Header user={user} setUser={setUser} setMessage={setMessage} />
      <div className="w-11/15 mx-auto text-center mt-10 bg-[#A14DA0] rounded-xl pt-10">
        <div>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl mb-10 text-white'>Ready Habits</h2>

          {/* Center the grid */}
          <div className="flex justify-center">
            <div
              className="grid grid-rows-3 grid-flow-col gap-5 overflow-x-auto max-w-4xl p-2 "
              style={{
                maxHeight: "30rem", // controls grid height
              }}
            >
              {readyHabits.map((habit, i) => (
                <div key={i} className="flex-shrink-0 ">
                  <button onClick={() => handleSelected(habit.text)} >
                                      <div
                                        className={`flex flex-col items-center justify-center w-30 h-30 rounded-xl shadow-md cursor-pointer mb-10
                                          outline-transparent outline-[1px] transition-all duration-150 ease-in-out 
                                          ${selected === encodeURIComponent(habit.text) ? "bg-green-600 outline-green-800 drop-shadow-xl" : "bg-[#7E1F86] hover:drop-shadow-xl text-white"}`}
                                      >
                                        <div className="text-2xl drop-shadow ">{habit.emoji ? habit.emoji : "✨"}</div>
                                        <h2 className={`text-center text-xs font-medium mt-1 text-white`}>
                                          {habit.text}
                                        </h2>
                                      </div>
                                    </button>
                </div>
              ))}
            </div>
          </div>
            <Link to={`/addhabit/${selected}`}>
            <h3 className={`normal-case font-bold text-lg btn btn-ghost tracking-tight mb-5 text-white hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md
              ${!selected ? 'opacity-50 pointer-events-none' : ''}`}
            >
              Create Habit
            </h3>
          </Link>
          <button
            onClick={handlePrompt}
            className="normal-case font-bold text-lg btn btn-ghost tracking-tight mb-5 text-white hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md"
          >
            Add Custom Habit
          </button>
        </div>
      </div>
    </div>
  );
}
