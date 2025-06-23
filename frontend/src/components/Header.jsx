import { Link, useLocation } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { ExperienceBar } from './ExperienceBar';
import { motion } from 'framer-motion';

export const Header = ({ user, setUser, shouldAnimate }) => {
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/allhabits", label: "Calendar" },
    { to: "/habits", label: "Habits" },
    { to: "/flowerfield", label: "Flowerfield" },
    { to: "/foods", label: "Foods" }
  ];

  return (
    <div className="w-full flex justify-center">
      <div className="navbar bg-[#9D79BC] text-base-content rounded-box w-full max-w-6xl px-4 py-2 flex-col md:flex-row md:justify-between md:items-center gap-4">

        {user && (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <UserCircle className="w-5 h-5" />
              {shouldAnimate ? (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {user.name} logged in
                </motion.span>
              ) : (
                <span>{user.name} logged in</span>
              )}
            </div>
            <ExperienceBar user={user} shouldAnimate={shouldAnimate} />
          </div>
        )}

        {user && (
          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            {navLinks.map(link => (
              shouldAnimate ? (
                <motion.div
                  key={link.to}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link
                    to={link.to}
                    className={`btn btn-ghost font-bold transition duration-150 ${
                      location.pathname === link.to ? 'text-yellow-300' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ) : (
                <div key={link.to}>
                  <Link
                    to={link.to}
                    className={`btn btn-ghost font-bold transition duration-150 ${
                      location.pathname === link.to ? 'text-yellow-300' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              )
            ))}

            {shouldAnimate ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.location.href = '/auth/signout?callbackUrl=/';
                  localStorage.removeItem('loggedFitnessappUser');
                  setUser(null);
                  toast.success("Successfully logged out");
                }}
                className="bg-[#7E1F86] text-white font-semibold px-4 py-2 rounded-box transition duration-150"
              >
                Log Out
              </motion.button>
            ) : (
              <button
                onClick={() => {
                  window.location.href = '/auth/signout?callbackUrl=/';
                  localStorage.removeItem('loggedFitnessappUser');
                  setUser(null);
                  toast.success("Successfully logged out");
                }}
                className="bg-[#7E1F86] text-white font-semibold px-4 py-2 rounded-box transition duration-150"
              >
                Log Out
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
