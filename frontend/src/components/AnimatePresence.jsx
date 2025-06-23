import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Your imports (components, routes, etc.)

export default function App({ user, setUser, caloriegoal, setCaloriesGoal, calorieseaten, setCaloriesEaten, setDiamonds, setExperience, readyHabits, setReadyHabits }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PublicRoute user={user}><PageWrapper><HomeScreen /></PageWrapper></PublicRoute>} />
        <Route path="/auth/callback" element={<PageWrapper><AuthCallback setUser={setUser} /></PageWrapper>} />
        <Route path="/auth/signout" element={<PageWrapper><SignOut /></PageWrapper>} />

        <Route path="/allhabits" element={<ProtectedRoute user={user}><PageWrapper><AllHabits user={user} /></PageWrapper></ProtectedRoute>} />
        <Route path="/flowerfield" element={<ProtectedRoute user={user}><PageWrapper><FlowerField user={user} setUser={setUser} /></PageWrapper></ProtectedRoute>} />
        <Route path="/foods" element={<ProtectedRoute user={user}><PageWrapper>
          <AddFoods
            user={user}
            setUser={setUser}
            caloriegoal={caloriegoal}
            setCaloriesGoal={setCaloriesGoal}
            calorieseaten={calorieseaten}
            setCaloriesEaten={setCaloriesEaten}
            setDiamonds={setDiamonds}
            setExperience={setExperience}
          />
        </PageWrapper></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><PageWrapper><DashBoard user={user} setUser={setUser} /></PageWrapper></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute user={user}><PageWrapper><Leaderboard user={user} setUser={setUser} /></PageWrapper></ProtectedRoute>} />

        <Route path="/habits" element={
          user ? (
            <PageWrapper>
              <HabitComponent
                userId={user.id}
                user={user}
                setUser={setUser}
                setReadyHabits={setReadyHabits}
                readyHabits={readyHabits}
              />
            </PageWrapper>
          ) : (
            <Navigate to="/" replace />
          )
        } />

        <Route path="/addhabit/:habitText" element={<PageWrapper><AddHabit user={user} setUser={setUser} readyHabits={readyHabits} /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

// Animation Wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, filter: 'blur(5px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }}
    transition={{ duration: 0.4 }}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);
