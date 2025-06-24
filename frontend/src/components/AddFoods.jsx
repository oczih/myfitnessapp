import { useState, useEffect } from "react";
import { Header } from "./Header";
import { AdjustCalories } from "./AdjustCalories";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import userservice from '../services/user'
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export const AddFoods = ({ user, setUser, caloriegoal, calorieseaten, setCaloriesGoal, setCaloriesEaten, setDiamonds, setExperience }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false)
  const fetchFood = async (query) => {
  try {
    setLoading(true)
    const response = await fetch(
  `http://localhost:3000/api/fatsecret/search-food?q=${encodeURIComponent(query)}`
);
    const data = await response.json();
    console.log("data:", data)
    setResults(data.products);
  } catch (error) {
    console.error("Error fetching food:", error);
  }finally {
    setLoading(false)
  }
};

  const handleFoodAdd = async (foodItem, amount) => {
  try {
    console.log("Using token:", user.token);
    const energy = parseFloat(foodItem.nutrients['energy-kcal_100g']) || 0;

      const parsedFood = {
        nutrients: [
          `Calories: ${energy} kcal`,
          `Fat: ${foodItem.nutrients['fat_100g'] || 0} g`,
          `Protein: ${foodItem.nutrients['proteins_100g'] || 0} g`,
          `Carbs: ${foodItem.nutrients['carbohydrates_100g'] || 0} g`
        ],
        foodName: foodItem.product_name,
        calories: energy * amount,
        portions: Number(amount)
      };
    console.log("Adding food with calories:", parsedFood.calories);
    const updatedUser = await userservice.postFood(user.id, parsedFood);

    setUser(updatedUser);
    setCaloriesEaten(updatedUser.calorieseaten);
    setDiamonds(updatedUser.diamonds + 2);
    setExperience(updatedUser?.experience + 2 );
    toast.success("Food added! +2 diamonds, +2 XP");
  } catch (error) {
    toast.error("Failed to add food.");
  }
};
const handleFoodDelete = async (foodItem) => {
  try {
    const updatedUser = await userservice.deleteFood(user.id, foodItem._id);
    setUser(updatedUser);
    setCaloriesEaten(updatedUser.calorieseaten);
    toast.success("Food deleted successfully.");
  } catch (error) {
    console.error('Error deleting food:', error);
    toast.error("Failed to delete food from diary.");
  }
};

  return (
    <div>
      <Header user={user} setUser={setUser} />
  <div className="w-11/12 mx-auto mt-5 mb-10 min-h-180 bg-stone-200 rounded-xl drop-shadow-md p-6">
  <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10">
    
    {/* Left: Calorie Goal Slider */}
    <div className="flex-1 mx-auto">
      <AdjustCalories
        user={user}
        setUser={setUser}
        toast={toast}
        caloriegoal={caloriegoal}
        calorieseaten={calorieseaten}
        setCaloriesGoal={setCaloriesGoal}
        setCaloriesEaten={setCaloriesEaten}
      />
    </div>

    {/* Center: Calorie Summary */}
    <div className="lg:w-1/3 w-full text-center">
      <h2 className="text-2xl text-[#7E1F86] font-extrabold tracking-tight">
        Calories eaten: {user.calorieseaten}/{user.caloriegoal}
      </h2>
      {user.foodsEaten?.length > 0 ? (
  user.foodsEaten
    .filter((foodItem) => {
      const today = new Date();
      const itemDate = new Date(foodItem.date);
      return (
        itemDate.getDate() === today.getDate() &&
        itemDate.getMonth() === today.getMonth() &&
        itemDate.getFullYear() === today.getFullYear()
      );
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((foodItem, index) => {

      return (
        <div
          key={index}
          className="bg-[#05a441] text-white font-semibold px-4 py-2 mt-2 mb-2 rounded-box hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md"
        >
          <h3 className="font-bold text-lg">
            {foodItem.foodName}{foodItem.portions ? ` (${foodItem.portions} portion(s))` : ""}
            {typeof foodItem.calories === "number" ? ` (${foodItem.calories} kcal)` : ""}
          </h3>
          <p className="text-sm text-white/70 mt-1">
            Eaten at:{" "}
            {new Date(foodItem.date).toLocaleTimeString("en-GB", {

              hour: "2-digit",
              minute: "2-digit",

            })}
          </p>
          <button
            className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md mt-4 bg-white text-[#7E1F86] px-4 py-2 rounded"
            onClick={() =>
              window.confirm("Do you want to delete from your diary?") &&
              handleFoodDelete(foodItem)
            }
          >
            Delete from the diary
          </button>
        </div>
      );
    })
) : (
  <p className="text-gray-500 mt-4 text-center">
    You haven't added any foods today!
  </p>
)}


    </div>

    {/* Right: Food Search and Results */}
    <div className="lg:w-1/3 w-full">
      <input
        className="border p-2 rounded-full bg-[#7E1F86] text-white w-full mb-4 hover:bg-[#621369] transition "
        type="text"
        placeholder="Search for food"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchFood(e.target.value);
          }
        }}
      />
      <div id="food-results" className="mt-4 flex flex-col gap-4">
        {loading ? (<Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>) : null}
        {results && results.length > 0 ? (
          results.slice(0, 5).map((foodItem) => (
            <div
              key={foodItem.food_id}
              className="bg-[#7E1F86] text-white font-semibold px-4 py-2 rounded-box hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md"
            >
              <img
                src={foodItem.image || "https://via.placeholder.com/150"}
                alt={foodItem.product_name}
                className="w-16 h-16 object-cover rounded mb-2"
              />
              <h3 className="font-bold text-lg">
                {foodItem.product_name}
                {foodItem.brands ? ` (${foodItem.brands})` : ""}
              </h3>
              <p>Kilocalories: {foodItem.nutrients['energy-kcal_100g'] ? foodItem.nutrients['energy-kcal_100g'] : 0 } kcal/100g</p>
              <p>Fat: {foodItem.nutrients['fat_100g'] ? foodItem.nutrients['fat_100g'] : 0} g/100g</p>
              <p>Protein: {foodItem.nutrients['proteins_100g'] ? foodItem.nutrients['proteins_100g'] : 0} g/100g</p>
              <p>Carbs: {foodItem.nutrients['carbohydrates_100g'] ? foodItem.nutrients['carbohydrates_100g'] : 0} g/100g</p>
              <button
                className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md mt-4 bg-white text-[#7E1F86] px-4 py-2 rounded"
                onClick={() => {
                  const amount = window.prompt("Add portion amount (1 portion = 100g): ");
                  if (amount) {
                    handleFoodAdd(foodItem, amount);
                  }
                }}
              >
                Add to the diary
              </button>
            </div>
          ))
        ) : (
          
          !loading ? <div className="text-base-100 mt-4 text-center">You haven't searched for any foods!</div> : ""
        )}
      </div>
    </div>
  </div>
</div>

    </div>
  );
};
