import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { ExperienceBar } from './ExperienceBar';
export const Header = ({ user, setUser }) => {
    return (
        <div>
            <div className="navbar justify-between bg-[#9D79BC] text-base-content rounded-box w-full max-w-3/5 mx-auto mt-5">
                {user && (
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="normal-case font-bold text-lg btn btn-ghost tracking-tight">
                            <UserCircle className="w-5 h-5" />
                            {user.name} logged in
                        </div>
                        <ExperienceBar user={user} /> 
                    </div>
                )}
                
                {/* Navigation Links & Auth */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
                    {user && (
                        <>
                        <Link to="/" className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                        <h3 className="normal-case font-bold text-lg btn btn-ghost tracking-tight">Dashboard</h3>
                        </Link>
                    <Link to={user ? "/allhabits" : "/"} className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                        <h3 className="normal-case font-bold text-lg btn btn-ghost tracking-tight">Calendar</h3>
                    </Link>

                            <Link to="/habits" className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                                <h3 className="normal-case font-bold text-lg btn btn-ghost tracking-tight">Habits</h3>
                            </Link>
                            <Link to="/flowerfield" className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                            <h3 className="normal-case font-bold text-lg btn btn-ghost tracking-tight">Flowerfield</h3>
                            </Link>
                            <Link to="/foods" className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                            <h3 className="normal-case font-bold text-lg btn btn-ghost tracking-tight">Foods</h3>
                            </Link>
                            <button
                                onClick={() => {
                                    window.location.href = '/auth/signout?callbackUrl=/';
                                    window.localStorage.removeItem('loggedFitnessappUser');
                                    setUser(null);
                                    toast("Successfully logged out")
                                }}
                                className="flex items-center gap-2 bg-[#7E1F86] font-semibold px-4 py-2 rounded-box hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md"
                            >
                                Log Out
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
