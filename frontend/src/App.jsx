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
import { fetchFullUser } from './services/user.js';
const App = () => {
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null); 
useEffect(() => {
  const initializeUser = async () => {
    const stored = window.localStorage.getItem('loggedFitnessappUser');
    if (stored) {
      const partialUser = JSON.parse(stored);
      if (!partialUser.id && partialUser._id) partialUser.id = partialUser._id;

      if (partialUser.token) {
        entries.setToken(partialUser.token);
        habitservice.setToken(partialUser.token);

        try {
          const fullUser = await fetchFullUser(partialUser.id, partialUser.token);
          setUser({ ...fullUser, token: partialUser.token }); // Combine full data with token
        } catch (error) {
          console.error('Failed to fetch full user:', error);
        }
      }
    }
  };

  initializeUser();
}, []);
const getTodayWeekday = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  return days[today.getDay()];
};
const todaysTasks = (user) => {
  if (!user || !user.entries) return [];
  const today = getTodayWeekday();
  return user.entries.filter(task => task.weekdays.includes(today));
}
const todaysHabits = todaysTasks(user);
const percentage = user ? ProgressBarPercentage(user) : 0;
  const ProtectedRoute = ({ user, children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    return children;
  };
  const PublicRoute = ({ user, children }) => {
    if (user) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };
  const DashBoard = ({user, setUser, setMessage}) => {
  return (
  <div>
    <Header user={user} setUser={setUser} setMessage={setMessage}/>
    <h1 className="text-4xl sm:text-5xl text-center mt-10 lg:text-6xl text-[#7E1F86] font-extrabold tracking-tight mb-6">
          Dashboard
        </h1>
        <h2 className='text-center text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>{getTodayWeekday()}</h2>
  {user && user.entries && user.entries.length > 0 && (
    <div className="text-center">
      <h2 className='text-xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>Your Progress Currently:</h2>
      <h2 className='text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>{percentage}%</h2>
    <div className="w-11/25 mx-auto bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
      {todaysHabits.map(task => 
      <div>
        <h3 key={task.id} className='text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>{task.title}</h3>
        </div>
      )}
    </div>)
    }
  </div>
  )
  }
  const HomeScreen = () => {
    return (
      <div className="w-full text-center mt-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#7E1F86] font-extrabold tracking-tight mb-6">
          Gamify your habits!
        </h1>
      </div>
    );
  };
  const [readyHabits, setReadyHabits] = useState([]);
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
        <Route path="/" element={
           <PublicRoute user={user}><HomeScreen /></PublicRoute>}/>
        <Route path="/auth/callback" element={<AuthCallback setUser={setUser} />} />
        <Route path="/auth/signout" element={<SignOut />} />
        <Route path="/dailyhabits" element={
        <ProtectedRoute user={user}><DailyHabits user={user} /></ProtectedRoute>} />
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}><DashBoard user={user} setUser={setUser} setMessage={setMessage}/></ProtectedRoute>} />
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
          {console.log(encodeURIComponent(habit.text))}
          return (
            <Route
              key={habit.text}
              path={`/addhabit/${encodeURIComponent(habit.text)}`}
              
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
