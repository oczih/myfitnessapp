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
import { AllHabits } from './components/AllHabits.jsx';
import entries from './services/entries';
import { ToastContainer, toast, Zoom } from 'react-toastify';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import ProgressBar from './components/ProgressBar.jsx';
import userservice from './services/user.js'
import { FlowerField } from './components/FlowerField.jsx';
import { AddFoods } from './components/AddFoods.jsx';
import HabitComparison from './components/HabitComparison.jsx';
const App = () => {
  const [user, setUser] = useState(null); 
  const [readyHabits, setReadyHabits] = useState([])
  const [diamonds, setDiamonds] = useState(0);
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
          const fullUser = await userservice.fetchFullUser(partialUser.id, partialUser.token);
          setUser({ ...fullUser, token: partialUser.token });
          toast("Added user!"); // Combine full data with token
          setDiamonds(fullUser.diamonds || 0);
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


const percentage = user ? ProgressBarPercentage({todaysHabits}) : 0;
useEffect(() => {
  if (percentage === 100) {
    // Fire confetti when percentage hits 100
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
      
    });
    try{
      handleDiamondsChange(5)
    }catch(error){
      console.log('Error updating diamonds:', error)
      return;
    }

  }
}, [percentage]);
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

  const handleDiamondsChange = async (diamonds) => {
    try {
      console.log("User token here: ",user.token)
      userservice.setToken(user.token)
      const updatedUser = await userservice.update(user.id, {diamonds})
      console.log('Updated user:', updatedUser)
      setDiamonds(updatedUser.diamonds)
      toast(`${diamonds.toString()} diamonds added! 💎`)
    }catch(error) {
      console.error('Error updating diamonds:', error)
      toast.error("Failed to update diamonds.")
    }
  }

const handleHabitDoneChange = async (habitId, taskdone, { setReadyHabits }) => {
  try {
    entries.setToken(user.token);
    const updatedTask = await entries.update(habitId, { done: !taskdone });
    console.log('Updated task:', updatedTask);

    setUser(prevUser => ({
      ...prevUser,
      entries: prevUser.entries.map(task =>
        task.id === habitId ? updatedTask : task
      )
    }));

    toast.success("Habit status updated successfully!");

    setReadyHabits(prev => {
      if (updatedTask.done) {
        // If task is now done, add it to readyHabits (avoid duplicates)
        const filtered = prev.filter(task => task.id !== habitId);
        return [...filtered, updatedTask];
      } else {
        // If task is now NOT done, remove it from readyHabits
        return prev.filter(task => task.id !== habitId);
      }
    });

  } catch (error) {
    console.error('Error updating habit status:', error);
    toast.error("Failed to update habit status.");
  }
}
  const DashBoard = ({user, setUser, }) => {
  return (
  <div>
    <Header user={user} setUser={setUser}/>
    <div className='w-11/15 mx-auto text-center mt-10 bg-stone-200 rounded-xl pt-10 pb-20 drop-shadow-md'>
     <h2 className='block text-left text-xl sm:text-xl lg:text-xl text-[#7E1F86] ml-5'>💎 Diamonds: {user.diamonds && user.diamonds >= 0 ? user.diamonds : 0}</h2>
    <h1 className="text-4xl sm:text-5xl text-center lg:text-6xl text-[#7E1F86] font-extrabold tracking-tight mb-10">
          Dashboard
        </h1>
        
        <h2 className='text-center text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>{getTodayWeekday()}</h2>
       
  {user && user.entries && user.entries.length > 0 && (
    <div className="text-center">
      <h2 className='text-xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>Your Progress Currently:</h2>
      <h2 className='text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mb-10'>{percentage}%</h2>
    <div className="w-2/4 mx-auto bg-gray-200 rounded-full h-2.5 overflow-hidden">
  <ProgressBar percentage={percentage} />
</div>
        {todaysHabits.length > 0 ? (
          todaysHabits.map(task => (
            <button
              key={task.id}
              onClick={() => handleHabitDoneChange(task.id, task.done, { setReadyHabits })}
              className={`w-1/3 text-left mx-auto mt-10 bg-[#A14DA0] rounded-full py-5 px-10 transition-shadow duration-200 flex items-center justify-between hover:shadow-xl cursor-pointer
              focus:outline-none focus:ring-2 focus:ring-green-500`}
              type="button"
            >
              <h3 className={`text-2xl text-white ${readyHabits.find(habit => habit.id === task.id) ? "line-through opacity-20" : "no-underline opacity-100"}`}>
                {task.title}{task.emoji ? task.emoji : "✨"}
              </h3>
              <motion.input
                type="checkbox"
                className={`checkbox ${task.done ? "checkbox-success" : ""}`}
                checked={task.done}
                onClick={e => e.stopPropagation()}  // <-- Prevent the button click toggle when clicking the checkbox
                onChange={() => handleHabitDoneChange(task.id, task.done, { setReadyHabits })}
                animate={{ scale: task.done ? 1.4 : 1 }}
                transition={{
                  duration: 0.15,
                  type: 'spring',
                  stiffness: 500,
                  damping: 20,
                  ease: ["easeIn", "easeOut"]
                }}
              />
            </button>
          ))
        ) : (
          <div>
            <h3 className='text-3xl sm:text-4xl lg:text-5xl text-[#7E1F86] mt-10 mb-10'>
              No habits for today!
            </h3>
          </div>
        )}
    </div>)
    }
  </div>
  </div>
  )
  }
  const HomeScreen = () => {
    return (
      <div className="w-full text-center mt-10">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#7E1F86] font-extrabold tracking-tight mb-6">
          Gamify your habits!
        </h1>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl text-[#7E1F86] font-extrabold tracking-tight mb-20 mt-30">
          Keep your habits going with{" "}
          <span className="bg-yellow-200 px-2 rounded-sm">
            flowers!
          </span>
          🌹
        </h1>
        {!user && (
          <a
            className="bg-blue-100 max-w-100 mx-auto text-blue-800 font-semibold px-4 py-2 rounded-full hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md flex items-center justify-center text-center"
            href="http://localhost:3000/auth/google"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5 mr-2"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Continue with Google
          </a>

      )}
              <div className="flex justify-end mr-130 mb-15">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#7E1F86" className="size-6 mr-3">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 19.5-15-15m0 0v11.25m0-11.25h11.25" />
        </svg>
          <h2 className="text-xl text-[#7E1F86] font-extrabold">click here to use it!</h2>
        </div>
      <HabitComparison />
      </div>
    );
  };


  
  useEffect(() => {
      if (!user || !user.id) return; 
      async function fetchUserHabits() {
        try {
          const res = await habitservice.getById(user.id);
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
<div className="relative min-h-screen bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[length:20px_20px] bg-repeat overflow-y-auto overflow-x-hidden">



      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        transition={Zoom}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={
           <PublicRoute user={user}><HomeScreen /></PublicRoute>}/>
        <Route path="/auth/callback" element={<AuthCallback setUser={setUser} />} />
        <Route path="/auth/signout" element={<SignOut />} />
        <Route path="/allhabits" element={
        <ProtectedRoute user={user}><AllHabits user={user} /></ProtectedRoute>} />
        <Route path="/flowerfield" element={
        <ProtectedRoute user={user}><FlowerField user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/foods" element={
        <ProtectedRoute user={user}><AddFoods user={user} setUser={setUser} /></ProtectedRoute>} />
        <Route path="/dashboard" element={
          <ProtectedRoute user={user}><DashBoard user={user} setUser={setUser}/></ProtectedRoute>} />
        <Route
          path="/habits"
          element={
            user ? (
              <HabitComponent 
              userId={user.id} 
              user={user} 
              setUser={setUser} 
              setReadyHabits={setReadyHabits}
              readyHabits={readyHabits} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/addhabit/:habitText"
          element={<AddHabit user={user} setUser={setUser} readyHabits={readyHabits} />}
        />
      </Routes>
    </div>
  )
  
}

// callback on localhost:5173/auth/callback
export default App
