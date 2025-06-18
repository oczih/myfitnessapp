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
  // Fetch user habits from backend
  useEffect(() => {
    async function fetchUserHabits() {
      const res = habitservice.getById(userId)
      setReadyHabits((prev) => [...prev, res]);
    }
    fetchUserHabits();
  }, [userId]);
  
  // Add new habit hand

  console.log(userHabits)
  const handlePrompt = async () => {
    const text = window.prompt("Enter your custom habit:");
    if (!text || text.trim() === "") return;
  
    const trimmed = text.trim();
  
    const res = await habitservice.createHabit({ userId, title: trimmed });
  
    if (res.status === 201) {
      setReadyHabits((prev) => [...prev, trimmed]);
      setMessage && setMessage("Habit added!");
    } else {
      alert("Failed to add habit");
    }
  };
  
  return (
    <div>
      <Header user={user} setUser={setUser} setMessage={setMessage}/>
      <div className="w-11/15 mx-auto text-center mt-10 bg-[#A14DA0] rounded-xl pt-10">
      <div className="">
      <h2 className='text-3xl sm:text-4xl lg:text-5xl mb-10'>Ready Habits</h2>

      {/* Center the grid */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-5 max-w-md">
          {readyHabits.map((habit, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center w-30 h-30 bg-[#7E1F86] text-white rounded-xl shadow-md cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="text-2xl drop-shadow">{habit.emoji}</div>
              <h2 className="text-center text-xs font-medium mt-1">{habit.text}</h2>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={handlePrompt}
        className="normal-case font-bold text-lg btn btn-ghost tracking-tight mt-10"
      >
        Add Custom Habit
      </button>
    </div>
      <h2 className='text-3xl sm:text-4xl lg:text-5xl mb-10 mt-10 text-center pb-10'>Your Habits</h2>
      {userHabits.length > 0 && (<ul>
        {userHabits.map((habit, i) => (
          <li key={i}>{habit}</li>
        ))}
      </ul>)}
      </div>
    </div>
  );
}
