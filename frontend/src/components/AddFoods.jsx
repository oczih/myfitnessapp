import { useState } from "react";
import { Header } from "./Header";
import { AdjustCalories } from "./AdjustCalories";
export const AddFoods = ({ user, setUser }) => {
  const [results, setResults] = useState([]);

  const fetchFood = async (query) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/fatsecret/search-food?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    setResults(data.foods.food); // 👈 Access the actual food array
  } catch (error) {
    console.error("Error fetching food:", error);
  }
};

  return (
    <div>
      <Header user={user} setUser={setUser} />
      <div className="w-11/15 mx-auto min-h-180 mb-10 text-center mt-5 bg-stone-200 rounded-xl pt-10 pb-20 drop-shadow-md">
        <input
          className="border p-2 rounded bg-[#7E1F86]"
          type="text"
          placeholder="Search for food"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchFood(e.target.value);
            }
          }}
        />
        <div id="food-results" className="mt-6 space-y-2 items-center flex">
          { results && results.length > 0 ? (
            results.slice(0, 5).map((foodItem) => (
                <div key={foodItem.food_id} className="gap-2 w-1/3 bg-[#7E1F86] font-semibold px-4 py-2 rounded-box hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md">
                    <h3 className="font-bold text-lg">
                    {foodItem.food_name}
                    {foodItem.brand_name ? ` (${foodItem.brand_name})` : ""}
                    </h3>
                    <p>{foodItem.food_description}</p>
                    <a
                    href={foodItem.food_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-800 underline"
                    >
                    View on FatSecret
                    </a>
                </div>
                ))
          ) : (
            <p className="text-gray-500 mt-4 mx-auto mb-10">No food results yet</p>
          )}
        </div>
        <div>
            <h2 className="text-2xl sm:text-2xl lg:text-2xl text-[#7E1F86] font-extrabold tracking-tight mb-6">Calories eaten: {user.calorieseaten}/{user.caloriegoal}</h2>
            <AdjustCalories user={user} setUser={setUser} />
        </div>
      </div>
    </div>
  );
};
