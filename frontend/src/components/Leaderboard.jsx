import { Header } from "./Header";
import userservice from "../services/user";
import { useEffect, useState } from "react";

const levels = [
  { level: 1, experience: 0 },
  { level: 2, experience: 100 },
  { level: 3, experience: 300 },
  { level: 4, experience: 600 },
  { level: 5, experience: 1000 },
  { level: 6, experience: 1500 },
  { level: 7, experience: 2100 },
  { level: 8, experience: 2800 },
  { level: 9, experience: 3600 },
  { level: 10, experience: 4500 },
];


export const Leaderboard = ({ user, setUser }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await userservice.getUsers();
        // Sort users descending by experience to show top first
        allUsers.sort((a, b) => b.experience - a.experience);
        setUsers(allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const getLevelFromExperience = (exp) => {
    let currentLevel = levels[0].level;
    for (let i = 0; i < levels.length; i++) {
      if (exp >= levels[i].experience) {
        currentLevel = levels[i].level;
      } else {
        break;
      }
    }
    return currentLevel;
  };

  return (
    <div className="rounded-xl bg-gradient-to-b from-purple-100 to-white pb-10">
      <Header user={user} setUser={setUser} />

      <h2 className="text-4xl font-extrabold text-center text-[#7E1F86] mt-10 mb-8">
        Leaderboard
      </h2>

      {users.length > 0 ? (
        <div className="max-w-4xl mx-auto space-y-4 px-4">
          {users.map((u, index) => {
            const level = getLevelFromExperience(u.experience);
            const calorieProgress = Math.min(
              (u.calorieseaten / u.caloriegoal) * 100,
              100
            );

            return (
              <div
                key={u.id}
                className="flex items-center bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition transition-shadow"
              >
                {/* Rank */}
                <div className="w-12 text-2xl font-bold text-purple-700 text-center">
                  #{index + 1}
                </div>

                {/* User Info */}
                <div className="flex-grow ml-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-900">
                        {u.name}
                      </h3>
                      {u.username && (
                        <p className="text-sm text-gray-500">@{u.username}</p>
                      )}
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-sm font-medium text-gray-700">
                        Level {level}
                      </p>
                      <p className="text-sm font-medium text-yellow-600">
                        {u.experience} XP
                      </p>
                    </div>
                  </div>

                  {/* Streak and Diamonds */}
                  <div className="flex space-x-6 mt-2 text-gray-700">
                    <div>
                      <span className="font-semibold">🔥 Streak:</span> {u.streak}{" "}
                      days
                    </div>
                    <div>
                      <span className="font-semibold">💎 Diamonds:</span> {u.diamonds}
                    </div>
                  </div>

                  {/* Calories Progress */}
                  <div className="mt-3">
                    <label
                      htmlFor={`calorie-bar-${u.id}`}
                      className="block text-sm font-semibold text-gray-600 mb-1"
                    >
                      Calories eaten: {u.calorieseaten} / {u.caloriegoal}
                    </label>
                    <div
                      id={`calorie-bar-${u.id}`}
                      className="w-full bg-gray-200 rounded-full h-4 overflow-hidden"
                      aria-label="calorie progress bar"
                    >
                      <div
                        className="h-4 bg-gradient-to-r from-yellow-400 to-yellow-600"
                        style={{ width: `${calorieProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-20 text-lg">
          No users found.
        </div>
      )}
    </div>
  );
};
