import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useMatch, useNavigate, Navigate
} from 'react-router-dom'
import { LoginElement } from './components/LoginElement'
import { Header } from './components/Header'
import AuthCallback from './components/AuthCallBack';
import SignOut from './components/SignOut'
import { ProgressBarPercentage } from './components/ProgressBarPercentage';
import HabitComponent from './components/Habits';
import { AddHabit } from './components/AddHabit';
import habitservice from './services/habits.js'
import { DailyHabits } from './components/DailyHabits.jsx';
import entries from './services/entries';
const App = () => {
  const [message, setMessage] = useState('')
  const getUserFromStorage = () => {
    const stored = window.localStorage.getItem('loggedFitnessappUser');
    if (!stored) return null;
    const user = JSON.parse(stored);
    if (!user.id && user._id) user.id = user._id;
     if (user.token) {
        entries.setToken(user.token);
        habitservice.setToken(user.token);
      }
    return user;
  };

  const [user, setUser] = useState(getUserFromStorage());
  const percentage = ProgressBarPercentage(user);
  const HomeScreen = () => {
  return (
  <div>
    <Header user={user} setUser={setUser} setMessage={setMessage}/>
    <div className="w-full text-center mt-10">
  <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#7E1F86] font-extrabold tracking-tight mb-6">
    Gamify your habits!
  </h1>
  </div>
  {user && user.entries && user.entries.length > 0 && (
    <div className="text-center">
      <h2 className='text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>Your Progress Currently:</h2>
      <h2 className='text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>{percentage}%</h2>
    <div className="w-11/25 mx-auto bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div></div>)
    }
  </div>
  )
  }
  
  const [readyHabits, setReadyHabits] = useState([]);
  console.log(readyHabits)
  useEffect(() => {
      if (!user || !user.id) return; 
      async function fetchUserHabits() {
        try {
          const res = await habitservice.getById(user.id);
          console.log(user.id)
          console.log(res);
          setReadyHabits(res);
  
        } catch (error) {
          console.error('Error fetching user habits:', error);
        }
      }
  
      fetchUserHabits();
    }, [user?.id, setReadyHabits])
  console.log(user)
  return(
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <Routes>
        <Route path="/" element={<HomeScreen />}/>
        <Route path="/auth/callback" element={<AuthCallback setUser={setUser} />} />
        <Route path="/auth/signout" element={<SignOut />} />
        <Route path="/dailyhabits" element={<DailyHabits user={user} />} /> 
        <Route
          path="/habits"
          element={
            user ? (
              
              <HabitComponent 
              userId={user.id} 
              user={user} 
              setUser={setUser} 
              setMessage={setMessage}
              setReadyHabits={setReadyHabits}
              readyHabits={readyHabits} />
              
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        {readyHabits.map(habit => {
          return (
            <Route 
              key={habit.text} 
              path={`/addhabit${habit.text}`} 
              element={<AddHabit habit={habit} user={user} setUser={setUser} setMessage={setMessage} />}
            />
          )
        })}
      </Routes>
    </div>
  )
}

// callback on localhost:5173/auth/callback
export default App
