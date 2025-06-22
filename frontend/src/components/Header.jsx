import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { ExperienceBar } from './ExperienceBar';

export const Header = ({ user, setUser }) => {
  return (
    <div className="w-full flex justify-center mt-5">
      <div className="navbar bg-[#9D79BC] text-base-content rounded-box w-full max-w-6xl px-4 py-2 flex-col md:flex-row md:justify-between md:items-center gap-4">
        
        {/* Left: User Info */}
        {user && (
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <UserCircle className="w-5 h-5" />
              {user.name} logged in
            </div>
            <ExperienceBar user={user} />
          </div>
        )}

        {/* Right: Navigation */}
        {user && (
          <div className="flex flex-wrap justify-center md:justify-end gap-3">
            <Link to="/" className="btn btn-ghost font-bold hover:scale-95 transition duration-150">
              Dashboard
            </Link>
            <Link to="/allhabits" className="btn btn-ghost font-bold hover:scale-95 transition duration-150">
              Calendar
            </Link>
            <Link to="/habits" className="btn btn-ghost font-bold hover:scale-95 transition duration-150">
              Habits
            </Link>
            <Link to="/flowerfield" className="btn btn-ghost font-bold hover:scale-95 transition duration-150">
              Flowerfield
            </Link>
            <Link to="/foods" className="btn btn-ghost font-bold hover:scale-95 transition duration-150">
              Foods
            </Link>
            <button
              onClick={() => {
                window.location.href = '/auth/signout?callbackUrl=/';
                localStorage.removeItem('loggedFitnessappUser');
                setUser(null);
                toast.success("Successfully logged out");
              }}
              className="bg-[#7E1F86] text-white font-semibold px-4 py-2 rounded-box hover:scale-95 transition duration-150"
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
