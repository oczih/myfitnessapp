import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';

export const Header = ({ user, setUser, setMessage }) => {
    return (
        <div>
            <div className="navbar justify-between bg-[#9D79BC] text-base-content rounded-box w-full max-w-xl mx-auto mt-5">
                {user && (
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="normal-case font-bold text-lg btn btn-ghost tracking-tight">
                            <UserCircle className="w-5 h-5" />
                            logged in
                        </div>
                    </div>
                )}
                
                {/* Navigation Links & Auth */}
                <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
                    <Link to="/" className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                        <h3 className="normal-case font-bold text-lg btn btn-ghost tracking-tight">Home</h3>
                    </Link>

                    <Link to={user ? "/suggestaperson" : "/login"} className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                        <h3 className="normal-case font-bold text-lg btn btn-ghost tracking-tight"></h3>
                    </Link>

                    {!user && (
                        <a
                            className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md flex items-center justify-center text-center"
                            href="http://localhost:3000/auth/google"
                        >
                            Continue with Google
                        </a>
                    )}

                    {user && (
                        <>
                            <Link to="/habits" className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                                <h3 className="normal-case font-bold text-lg btn btn-ghost tracking-tight">Habits</h3>
                            </Link>

                            <button
                                onClick={() => {
                                    window.location.href = '/auth/signout?callbackUrl=/';
                                    window.localStorage.removeItem('loggedFitnessappUser');
                                    setUser(null);
                                    setMessage("Successfully logged out!");
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
