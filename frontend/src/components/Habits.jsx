import { useState, useEffect } from "react";
import habitservice from '../services/habits'
import { Header } from '../components/Header'

export default function HabitComponent({ userId, user, setUser, setMessage }) {
  const [readyHabits, setReadyHabits] = useState([
    {text: "Drink Water",
      emoji: "💧"
    },
    {
      text: "Exercise",
      emoji: "🏋️"
    },
    {
      text: "Read Book",
      emoji: "📚"
    },
    {
      text: "Meditate",
      emoji: "🧘"
    },
    {
      text: "Sleep Early",
      emoji: "🌙"
    },
    {
      text: "Eat Healthy",
      emoji: "🥗"
    },
    {
      text: "Journal",
      emoji: "📓"
    },
  ]);
  const [userHabits, setUserHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");

  // Fetch user habits from backend
  useEffect(() => {
    async function fetchUserHabits() {
      const res = habitservice.getById(userId)
      setUserHabits(res);
    }
    fetchUserHabits();
  }, [userId]);
  
  // Add new habit handler
  const addHabit = async () => {
    if (!newHabit.trim()) return;

    const res = habitservice.createHabit({ userId, habit: newHabit })

    if (res.ok) {
      setUserHabits((prev) => [...prev, newHabit]);
      setNewHabit("");
    } else {
      alert("Failed to add habit");
    }
  };


  const handlePrompt = () => {
    const text = window.prompt("Enter your custom habit:");
    if (!text || text.trim() === "") return; // Ignore empty input
  
    const trimmed = text.trim();
    setNewHabit(trimmed);
  };
  return (
    <div>
      <Header user={user} setUser={setUser} setMessage={setMessage}/>
      <div className="w-11/14 mx-auto text-center mt-10 bg-[#A14DA0] rounded-md">
      <div className="w-11/14 mx-auto text-center mt-10 bg-[#A14DA0] rounded-md p-6">
      <h2 className='text-3xl sm:text-4xl lg:text-5xl mb-10'>Ready Habits</h2>

      {/* Center the grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-4 max-w-md">
          {readyHabits.map((habit, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center w-20 h-20 bg-[#7E1F86] text-white rounded-xl shadow-md cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="text-2xl drop-shadow">{habit.emoji}</div>
              <h2 className="text-center text-xs font-medium mt-1">{habit.text}</h2>
            </div>
          ))}
        </div>
      </div>
    </div>
      <h2 className='text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>Your Habits</h2>
      {userHabits.length > 0 && (<ul>
        {userHabits.map((habit, i) => (
          <li key={i}>{habit}</li>
        ))}
      </ul>)}
      <button
        onClick={handlePrompt}
        className="bg-purple-100 text-purple-800 font-semibold px-4 py-2 rounded-full hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md"
      >
        Add Custom Habit
      </button>
        <button onClick={addHabit} className='text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>Add Habit</button>
        </div>
    </div>
  );
}
