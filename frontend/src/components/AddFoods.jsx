import { useState, useEffect } from "react";
import { Header } from "./Header";
import { AdjustCalories } from "./AdjustCalories";
import { ToastContainer, toast, Zoom } from 'react-toastify';
import userservice from '../services/user'

export const AddFoods = ({ user, setUser, caloriegoal, calorieseaten, setCaloriesGoal, setCaloriesEaten, setDiamonds, setExperience }) => {
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
  const extractCalories = (description) => {
  const match = description.match(/(\d+)\s*kcal/i);
  return match ? parseInt(match[1]) : 0;
}; 

  const handleFoodAdd = async (foodItem) => {
  try {
    userservice.setToken(user.token);

    const parsedFood = {
      foodName: foodItem.food_name,
      nutrients: foodItem.food_description,
      calories: extractCalories(foodItem.food_description),
    };

    const updatedUser = await userservice.postFood(user.id, parsedFood);

    setUser(updatedUser);
    setCaloriesEaten(updatedUser.calorieseaten);
    setDiamonds(updatedUser.diamonds);
    setExperience(updatedUser.experience);

    toast.success("Food added! +2 diamonds, +2 XP");
  } catch (error) {
    toast.error("Failed to add food.");
  }
};
const handleFoodDelete = async (foodItem) => {
  try {
    userservice.setToken(user.token);

    // Find the food item index in the user's foodsEaten array
    const foodIndex = user.foodsEaten.findIndex(
      (item) => item.foodName === foodItem.foodName && item._id === foodItem._id
    );
    console.log('Food index:', foodIndex);
    if (foodIndex !== -1) {
      // Remove the food item from the array
      const updatedFoods = [...user.foodsEaten];
      const calories = user.calorieseaten - foodItem.calories
      updatedFoods.splice(foodIndex, 1)
      console.log('Updated foods:', updatedFoods);
      // Update the user's foodsEaten and calorieseaten
      console.log('FoodItem:', foodItem)
      const updatedUser = await userservice.update(user.id, {
        foodsEaten: updatedFoods,
        calorieseaten: calories,
      });
      console.log('Updated User:', updatedUser)
      setUser(updatedUser);
      setCaloriesEaten(updatedUser.calorieseaten);
      toast.success("Food deleted successfully.");
    } else {
      toast.error("Food item not found in diary.");
    }
  } catch (error) {
    console.error('Error deleting food:', error);
    toast.error("Failed to delete food from diary.");
  }
}


  return (
    <div>
      <Header user={user} setUser={setUser} />
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
  <div className="w-11/12 mx-auto mt-5 mb-10 min-h-180 bg-stone-200 rounded-xl drop-shadow-md p-6">
  <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10">
    
    {/* Left: Calorie Goal Slider */}
    <div className="lg:w-1/3 w-full">
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
      const cleanedNutrients = foodItem.nutrients
        .replace(/\s*[-–—]?\s*\d+\s*kcal/gi, '')  // removes " - 350 kcal" or "–350 kcal" etc.
        .replace(/\s{2,}/g, ' ')                 // extra spaces cleanup
        .trim();

      return (
        <div
          key={index}
          className="bg-[#05a441] text-white font-semibold px-4 py-2 mt-2 mb-2 rounded-box hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md"
        >
          <h3 className="font-bold text-lg">
            {foodItem.foodName}
            {foodItem.calories ? ` (${foodItem.calories} kcal)` : ""}
          </h3>
          {cleanedNutrients && (
            <p className="text-sm italic text-white/80">{cleanedNutrients}</p>
          )}
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
        className="border p-2 rounded bg-[#7E1F86] text-white w-full mb-4"
        type="text"
        placeholder="Search for food"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchFood(e.target.value);
          }
        }}
      />
      <div id="food-results" className="mt-4 flex flex-col gap-4">
        {results && results.length > 0 ? (
          results.slice(0, 5).map((foodItem) => (
            <div
              key={foodItem.food_id}
              className="bg-[#7E1F86] text-white font-semibold px-4 py-2 rounded-box hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md"
            >
              <h3 className="font-bold text-lg">
                {foodItem.food_name}
                {foodItem.brand_name ? ` (${foodItem.brand_name})` : ""}
              </h3>
              <p>{foodItem.food_description}</p>
              <button
                className="hover:scale-95 transition-transform duration-150 ease-in-out drop-shadow-md mt-4 bg-white text-[#7E1F86] px-4 py-2 rounded"
                onClick={() =>
                  window.confirm("Do you want to add this to your diary") &&
                  handleFoodAdd(foodItem)
                }
              >
                Add to the diary
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-4 text-center">No food results yet</p>
        )}
      </div>
    </div>
  </div>
</div>

    </div>
  );
};
